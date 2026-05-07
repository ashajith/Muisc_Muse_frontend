import { create } from "zustand";

const audio = new Audio();

const safePlay = async () => {
  try {
    await audio.play();
    return true;
  } catch (err) {
    console.warn("Audio play failed:", err.message);
    return false;
  }
};

// Fetch playable URL from JioSaavn via our backend
const fetchAudioUrl = async (title, artist) => {
  try {
    const params = new URLSearchParams({ title, artist: artist || "" });
    const res = await fetch(`http://127.0.0.1:8000/api/audio/?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.audio_url || null;
  } catch (err) {
    console.warn("fetchAudioUrl failed:", err.message);
    return null;
  }
};

const usePlayerStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  currentSong: null,
  queue: [],
  originalQueue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  repeat: "none",
  shuffle: false,
  likedSongs: new Set(),

  // ── Internal: resolve URL (Spotify preview → JioSaavn fallback) then play
  _loadAndPlay: async (song) => {
    let url = song.audio_url;

    if (!url) {
      const artistName =
        typeof song.artist === "object" ? song.artist?.name : song.artist;
      url = await fetchAudioUrl(song.title, artistName);
    }

    if (!url) {
      // No audio found anywhere — song shows in bar but won't play
      set({ isPlaying: false });
      return;
    }

    audio.src = url;
    audio.volume = get().volume;
    const ok = await safePlay();
    set({ isPlaying: ok });
  },

  // ── Play a song ───────────────────────────────────────────
  playSong: async (song, queue = []) => {
    const { shuffle } = get();
    let newQueue = queue.length ? queue : [song];

    set({
      currentSong: song,
      originalQueue: newQueue,
      queue: shuffle ? shuffleQueue(newQueue, song) : newQueue,
      isPlaying: false,
      progress: 0,
      duration: 0,
    });

    await get()._loadAndPlay(song);
  },

  // ── Play / Pause toggle ───────────────────────────────────
  togglePlay: async () => {
    const { isPlaying, currentSong } = get();
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      // If no src loaded yet, try fetching again
      if (!audio.src || audio.src === window.location.href) {
        await get()._loadAndPlay(currentSong);
      } else {
        const ok = await safePlay();
        set({ isPlaying: ok });
      }
    }
  },

  // ── Skip to next ──────────────────────────────────────────
  playNext: async () => {
    const { currentSong, queue, repeat, originalQueue, shuffle } = get();
    if (!queue.length) return;

    if (repeat === "one") {
      audio.currentTime = 0;
      const ok = await safePlay();
      set({ isPlaying: ok, progress: 0 });
      return;
    }

    const idx = queue.findIndex((s) => s.id === currentSong?.id);
    const isLast = idx === queue.length - 1;

    if (isLast) {
      if (repeat === "all") {
        const newQueue = shuffle ? shuffleQueue(originalQueue) : originalQueue;
        const next = newQueue[0];
        set({ queue: newQueue, currentSong: next, isPlaying: false, progress: 0 });
        await get()._loadAndPlay(next);
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
      return;
    }

    const next = queue[idx + 1];
    set({ currentSong: next, isPlaying: false, progress: 0 });
    await get()._loadAndPlay(next);
  },

  // ── Previous / Restart ────────────────────────────────────
  playPrev: async () => {
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

    const prev = queue[idx - 1];
    set({ currentSong: prev, isPlaying: false, progress: 0 });
    await get()._loadAndPlay(prev);
  },

  seek: (seconds) => { audio.currentTime = seconds; set({ progress: seconds }); },
  setVolume: (val) => { audio.volume = val; set({ volume: val }); },

  toggleShuffle: () => {
    const { shuffle, originalQueue, currentSong } = get();
    const newShuffle = !shuffle;
    set({
      shuffle: newShuffle,
      queue: newShuffle ? shuffleQueue(originalQueue, currentSong) : originalQueue,
    });
  },

  cycleRepeat: () => {
    const map = { none: "all", all: "one", one: "none" };
    set((state) => ({ repeat: map[state.repeat] }));
  },

  toggleLike: async (songId) => {
    const { likedSongs } = get();
    const token = localStorage.getItem("access_token");
    const isLiked = likedSongs.has(songId);
    const updated = new Set(likedSongs);
    isLiked ? updated.delete(songId) : updated.add(songId);
    set({ likedSongs: updated });
    try {
      await fetch(`http://127.0.0.1:8000/api/songs/${songId}/like/`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Like toggle failed", err);
      set({ likedSongs });
    }
  },

  loadLikedSongs: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/songs/liked/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ likedSongs: new Set(data.map((s) => s.id)) });
    } catch (err) {
      console.error("Failed to load liked songs", err);
    }
  },

  syncProgress: () => {
    set({ progress: audio.currentTime, duration: audio.duration || 0 });
  },
}));

audio.addEventListener("timeupdate", () => usePlayerStore.getState().syncProgress());
audio.addEventListener("ended", () => usePlayerStore.getState().playNext());
audio.addEventListener("error", () => usePlayerStore.setState({ isPlaying: false }));

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