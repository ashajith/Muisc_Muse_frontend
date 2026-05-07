import axios from "axios";

const API = "http://127.0.0.1:8000/api";

/**
 * GET /api/youtube/trending/?region=IN&limit=10
 * Returns trending YouTube music videos.
 */
export const getYoutubeTrending = async (region = "IN", limit = 10) => {
  const res = await axios.get(`${API}/youtube/trending/`, {
    params: { region, limit },
  });
  return res.data;
};

/**
 * GET /api/youtube/search/?q=<query>&limit=10
 * Searches YouTube for music videos.
 */
export const searchYoutubeMusic = async (query, limit = 10) => {
  const res = await axios.get(`${API}/youtube/search/`, {
    params: { q: query, limit },
  });
  return res.data;
};

/**
 * GET /api/youtube/artists/
 * Returns popular artist channels from YouTube.
 */
export const getYoutubeArtists = async () => {
  const res = await axios.get(`${API}/youtube/artists/`);
  return res.data;
};

/**
 * GET /api/youtube/playlists/
 * Returns curated music playlists from YouTube.
 */
export const getYoutubePlaylists = async () => {
  const res = await axios.get(`${API}/youtube/playlists/`);
  return res.data;
};

/**
 * GET /api/youtube/playlists/<playlistId>/
 * Returns metadata + video list for a YouTube playlist.
 */
export const getYoutubePlaylistDetail = async (playlistId) => {
  const res = await axios.get(`${API}/youtube/playlists/${playlistId}/`);
  return res.data;
};
