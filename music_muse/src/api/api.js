const BASE_URL = "http://127.0.0.1:8000/api";

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