const BASE_URL = "http://127.0.0.1:8000/api";

// ── Spotify / DB ──────────────────────────────────────────────────────────────

export const getArtists = async () => {
  const res = await fetch(`${BASE_URL}/artists/`);
  return res.json();
};

export const getSongs = async () => {
  const res = await fetch(`${BASE_URL}/songs/`);
  return res.json();
};

export const getPlaylists = async () => {
  const res = await fetch(`${BASE_URL}/playlists/`);
  return res.json();
};

// ── YouTube ───────────────────────────────────────────────────────────────────

export const getYoutubeTrending = async (region = "IN", limit = 10) => {
  const res = await fetch(
    `${BASE_URL}/youtube/trending/?region=${region}&limit=${limit}`
  );
  return res.json();
};

export const searchYoutubeMusic = async (query, limit = 10) => {
  const res = await fetch(
    `${BASE_URL}/youtube/search/?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return res.json();
};

export const getYoutubeArtists = async () => {
  const res = await fetch(`${BASE_URL}/youtube/artists/`);
  return res.json();
};

export const getYoutubePlaylists = async () => {
  const res = await fetch(`${BASE_URL}/youtube/playlists/`);
  return res.json();
};

export const getYoutubePlaylistDetail = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/youtube/playlists/${playlistId}/`);
  return res.json();
};
