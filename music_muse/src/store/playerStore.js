import { create } from "zustand";

const audio = new Audio();
audio.crossOrigin = "anonymous";

// ─── Fetch YouTube audio URL from backend ─────────────────────────────────────
async function fetchYouTubeAudioUrl(title, artist) {
  try {
    const params = new URLSearchParams({ title, artist });
    const res = await fetch(`http://localhost:8000/api/audio/?${params}`);
    const data = await res.json();
    return data.audio_url || null;
  } catch (err) {
    console.error("[Player] Failed to fetch audio URL:", err);
    return null;
  }
}

const usePlayerStore = create((set, get) => ({
  // State
  currentSong: null,
  queue: [],
  originalQueue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  repeat: "none",       // "none" | "all" | "one"
  shuffle: false,
  likedSongs: new Set(),
  isLoadingAudio: false, // ✅ loading state while fetching YouTube URL
  noPreview: false,

  // ─── Play a song ─────────────────────────────────────────────────────────────
  playSong: async (song, queue = []) => {
    const { shuffle, volume } = get();
    const newQueue = queue.length ? queue : [song];

    // Show song in playerbar immediately while we fetch the audio URL
    set({
      currentSong: song,
      originalQueue: newQueue,
      queue: shuffle ? shuffleQueue(newQueue, song) : newQueue,
      isPlaying: false,
      isLoadingAudio: true,
      noPreview: false,
      progress: 0,
      duration: 0,
    });

    // Fetch YouTube audio URL from backend
    const artistName = song.artist?.name || song.artist || "";
    const audioUrl = await fetchYouTubeAudioUrl(song.title, artistName);

    if (!audioUrl) {
      set({ isLoadingAudio: false, noPreview: true, isPlaying: false });
      return;
    }

    // Set audio source and play
    audio.src = audioUrl;
    audio.volume = volume;

    try {
      await audio.play();
      set({ isPlaying: true, isLoadingAudio: false, noPreview: false });
    } catch (err) {
      console.warn("[Player] Audio play failed:", err);
      set({ isPlaying: false, isLoadingAudio: false, noPreview: true });
    }
  },

  // ─── Play / Pause toggle ─────────────────────────────────────────────────────
  togglePlay: () => {
    const { isPlaying, noPreview, isLoadingAudio } = get();
    if (noPreview || isLoadingAudio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn("[Player] play failed:", err));
    }
    set({ isPlaying: !isPlaying });
  },

  // ─── Skip to next ────────────────────────────────────────────────────────────
  playNext: () => {
    const { currentSong, queue, repeat, originalQueue, shuffle } = get();
    if (!queue.length) return;

    if (repeat === "one") {
      audio.currentTime = 0;
      audio.play();
      return;
    }

    const idx = queue.findIndex((s) => s.id === currentSong?.id);
    const isLast = idx === queue.length - 1;

    if (isLast) {
      if (repeat === "all") {
        const newQueue = shuffle ? shuffleQueue(originalQueue) : originalQueue;
        get().playSong(newQueue[0], newQueue);
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
      return;
    }

    get().playSong(queue[idx + 1], queue);
  },

  // ─── Previous / Restart ──────────────────────────────────────────────────────
  playPrev: () => {
    const { currentSong, queue, progress } = get();
    if (!queue.length) return;

    if (progress > 3) {
      audio.currentTime = 0;
      set({ progress: 0 });
      return;
    }

    const idx = queue.findIndex((s) => s.id === currentSong?.id);
    if (idx <= 0) {
      audio.currentTime = 0;
      set({ progress: 0 });
      return;
    }

    get().playSong(queue[idx - 1], queue);
  },

  // ─── Seek ────────────────────────────────────────────────────────────────────
  seek: (seconds) => {
    audio.currentTime = seconds;
    set({ progress: seconds });
  },

  // ─── Volume ──────────────────────────────────────────────────────────────────
  setVolume: (val) => {
    audio.volume = val;
    set({ volume: val });
  },

  // ─── Shuffle ─────────────────────────────────────────────────────────────────
  toggleShuffle: () => {
    const { shuffle, originalQueue, currentSong } = get();
    const newShuffle = !shuffle;
    set({
      shuffle: newShuffle,
      queue: newShuffle ? shuffleQueue(originalQueue, currentSong) : originalQueue,
    });
  },

  // ─── Repeat: none → all → one → none ────────────────────────────────────────
  cycleRepeat: () => {
    const map = { none: "all", all: "one", one: "none" };
    set((state) => ({ repeat: map[state.repeat] }));
  },

  // ─── Like toggle ─────────────────────────────────────────────────────────────
  toggleLike: async (songId) => {
    const { likedSongs } = get();
    const token = localStorage.getItem("access_token");
    const isLiked = likedSongs.has(songId);

    const updated = new Set(likedSongs);
    isLiked ? updated.delete(songId) : updated.add(songId);
    set({ likedSongs: updated });

    try {
      await fetch(`http://localhost:8000/api/songs/${songId}/like/`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Like toggle failed", err);
      set({ likedSongs });
    }
  },

  // ─── Load liked songs ────────────────────────────────────────────────────────
  loadLikedSongs: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/songs/liked/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ likedSongs: new Set(data.map((s) => s.id)) });
    } catch (err) {
      console.error("Failed to load liked songs", err);
    }
  },

  // ─── Sync progress ───────────────────────────────────────────────────────────
  syncProgress: () => {
    set({ progress: audio.currentTime, duration: audio.duration || 0 });
  },
}));

// ─── Audio event listeners ───────────────────────────────────────────────────
audio.addEventListener("timeupdate", () => {
  usePlayerStore.getState().syncProgress();
});

audio.addEventListener("ended", () => {
  usePlayerStore.getState().playNext();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffleQueue(queue, currentSong = null) {
  const arr = [...queue];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (currentSong) {
    const idx = arr.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) { arr.splice(idx, 1); arr.unshift(currentSong); }
  }
  return arr;
}

export default usePlayerStore;