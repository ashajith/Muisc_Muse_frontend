import { useEffect, useState } from "react";
import { getArtists, getSongs, getPlaylists } from "../api/api";

const useMusicData = () => {
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, songsData, playlistsData] = await Promise.all([
          getArtists(),
          getSongs(),
          getPlaylists(),
        ]);

        setArtists(artistsData);
        setSongs(songsData);
        setPlaylists(playlistsData);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { artists, songs, playlists, loading };
};

export default useMusicData;