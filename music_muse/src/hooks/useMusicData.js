import { useEffect, useState } from "react";
import {
  getArtists,
  getSongs,
  getPlaylists,
  getYoutubeTrending,
  getYoutubePlaylists,
  getYoutubeArtists,
} from "../api/api";

/**
 * useMusicData — fetches Spotify + YouTube data in parallel.
 *
 * Returns:
 *   Spotify:  artists, songs, playlists
 *   YouTube:  youtubeTrending, youtubePlaylists, youtubeArtists
 *   State:    loading, error
 */
const useMusicData = () => {
  // ── Spotify / DB ────────────────────────────────────────────────────────────
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // ── YouTube ─────────────────────────────────────────────────────────────────
  const [youtubeTrending, setYoutubeTrending] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [youtubeArtists, setYoutubeArtists] = useState([]);

  // ── Shared state ────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          artistsData,
          songsData,
          playlistsData,
          ytTrending,
          ytPlaylists,
          ytArtists,
        ] = await Promise.all([
          getArtists(),
          getSongs(),
          getPlaylists(),
          getYoutubeTrending("IN", 10),
          getYoutubePlaylists(),
          getYoutubeArtists(),
        ]);

        setArtists(artistsData);
        setSongs(songsData);
        setPlaylists(playlistsData);
        setYoutubeTrending(ytTrending);
        setYoutubePlaylists(ytPlaylists);
        setYoutubeArtists(ytArtists);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to load music data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    // Spotify / DB
    artists,
    songs,
    playlists,
    // YouTube
    youtubeTrending,
    youtubePlaylists,
    youtubeArtists,
    // State
    loading,
    error,
  };
};

export default useMusicData;
