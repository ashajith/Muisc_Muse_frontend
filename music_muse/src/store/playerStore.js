import { create } from "zustand";

const audio = new Audio();

const usePlayerStore = create((set, get) => ({
  // State
  currentSong: null,
  queue: [],
  originalQueue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  repeat: "none", // "none" | "all" | "one"
  shuffle: false,
  likedSongs: new Set(),

  // ─── Play a song ───────────────────────────────────────────
  playSong: (song, queue = []) => {
    const { shuffle } = get();

    audio.src = song.audio_url;
    audio.volume = get().volume;
    audio.play();

    let newQueue = queue.length ? queue : [song];

    set({
      currentSong: song,
      originalQueue: newQueue,
      queue: shuffle ? shuffleQueue(newQueue, song) : newQueue,
      isPlaying: true,
      progress: 0,
      duration: 0,
    });
  },

  // ─── Play / Pause toggle ───────────────────────────────────
  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    set({ isPlaying: !isPlaying });
  },

  // ─── Skip to next ──────────────────────────────────────────
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
        const next = newQueue[0];
        audio.src = next.audio_url;
        audio.play();
        set({ queue: newQueue, currentSong: next, isPlaying: true, progress: 0 });
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
      return;
    }

    const next = queue[idx + 1];
    audio.src = next.audio_url;
    audio.volume = get().volume;
    audio.play();
    set({ currentSong: next, isPlaying: true, progress: 0 });
  },

  // ─── Previous / Restart ────────────────────────────────────
  playPrev: () => {
    const { currentSong, queue, progress } = get();
    if (!queue.length) return;

    // If more than 3s in, restart current song
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
    audio.src = prev.audio_url;
    audio.volume = get().volume;
    audio.play();
    set({ currentSong: prev, isPlaying: true, progress: 0 });
  },

  // ─── Seek ──────────────────────────────────────────────────
  seek: (seconds) => {
    audio.currentTime = seconds;
    set({ progress: seconds });
  },

  // ─── Volume ────────────────────────────────────────────────
  setVolume: (val) => {
    audio.volume = val;
    set({ volume: val });
  },

  // ─── Shuffle ───────────────────────────────────────────────
  toggleShuffle: () => {
    const { shuffle, originalQueue, currentSong } = get();
    const newShuffle = !shuffle;
    set({
      shuffle: newShuffle,
      queue: newShuffle
        ? shuffleQueue(originalQueue, currentSong)
        : originalQueue,
    });
  },

  // ─── Repeat cycling: none → all → one → none ──────────────
  cycleRepeat: () => {
    const map = { none: "all", all: "one", one: "none" };
    set((state) => ({ repeat: map[state.repeat] }));
  },

  // ─── Like toggle (JWT authenticated) ──────────────────────
  toggleLike: async (songId) => {
    const { likedSongs } = get();
    const token = localStorage.getItem("access_token");
    const isLiked = likedSongs.has(songId);

    // Optimistic update
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
      // Rollback on failure
      console.error("Like toggle failed", err);
      set({ likedSongs });
    }
  },

  // ─── Load liked songs on login ─────────────────────────────
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

  // ─── Sync progress from audio element ─────────────────────
  syncProgress: () => {
    set({ progress: audio.currentTime, duration: audio.duration || 0 });
  },
}));

// ─── Wire up audio events (singleton, outside store) ────────────
audio.addEventListener("timeupdate", () => {
  usePlayerStore.getState().syncProgress();
});

audio.addEventListener("ended", () => {
  usePlayerStore.getState().playNext();
});

// ─── Helpers ────────────────────────────────────────────────────
function shuffleQueue(queue, currentSong = null) {
  const arr = [...queue];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Keep current song at front if provided
  if (currentSong) {
    const idx = arr.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) {
      arr.splice(idx, 1);
      arr.unshift(currentSong);
    }
  }
  return arr;
}

export default usePlayerStore;