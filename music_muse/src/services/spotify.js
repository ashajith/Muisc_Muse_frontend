import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const getTracks = async () => {
  const res = await axios.get(`${API}/tracks/`);
  return res.data;
};

export const getArtists = async () => {
  const res = await axios.get(`${API}/artists/`);
  return res.data;
};

export const getPlaylists = async () => {
  const res = await axios.get(`${API}/playlists/`);
  return res.data;
};


export const getPlaylistSongs = async (playlistId) => {
  const res = await fetch(`http://localhost:8000/api/playlists/${playlistId}/`);
  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json(); // expects { playlist: {...}, songs: [...] }
};