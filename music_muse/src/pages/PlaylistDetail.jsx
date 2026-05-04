import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePlayerStore from "../store/playerStore";
import Layout from "../components/Layout";
import "../styles/playlist_detail.css";
import { getPlaylistSongs } from "../services/spotify";

// ─── API helper ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000/api";

const getPlaylistSongs = async (playlistId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/playlists/${playlistId}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Failed to fetch playlist (${res.status})`);
  return res.json(); // { playlist: {...}, songs: [...] }
};
// ───────────────────────────────────────────────────────────────────────────────

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const data = await getPlaylistSongs(id);
        setPlaylist(data.playlist);
        setSongs(data.songs);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ── Playback ───────────────────────────────────────────────────────────────
  const handlePlaySong = useCallback(
    (song) => {
      if (currentSong?.id === song.id) togglePlay();
      else playSong(song, songs);
    },
    [currentSong, songs, playSong, togglePlay]
  );

  // ── Formatters ─────────────────────────────────────────────────────────────
  const formatDuration = (sec) => {
    if (!sec) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const formatDateAdded = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalDuration = songs.reduce((a, s) => a + (s.duration || 0), 0);
  const totalHr = Math.floor(totalDuration / 3600);
  const totalMin = Math.floor((totalDuration % 3600) / 60);
  const durationLabel = totalHr > 0
    ? `${totalHr} hr ${totalMin} min`
    : `${totalMin} min`;

  const playlistIsActive = songs.some((s) => s.id === currentSong?.id);

  // ── Explicit badge ─────────────────────────────────────────────────────────
  const ExplicitBadge = () => (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-neutral-500 text-[9px] font-bold text-black leading-none ml-1 flex-shrink-0">
      E
    </span>
  );

  // ── States ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="h-full flex flex-col items-center justify-center gap-4 text-neutral-400">
          <span className="material-symbols-outlined text-5xl animate-spin" style={{ animationDuration: "1.5s" }}>
            refresh
          </span>
          <p className="text-sm font-medium tracking-wide">Loading playlist…</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="h-full flex flex-col items-center justify-center gap-4 text-neutral-400">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  if (!playlist) return null;

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-24! pb-12! px-8! overflow-hidden bg-[linear-gradient(90deg,#3F2F4A_0%,#151318_45%,#2A304A_100%)]">

        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 blur-[100px] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary rounded-full" />
          <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-tertiary rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row items-end gap-8 relative z-10">

          {/* Playlist cover */}
          <div className="w-full md:w-72 aspect-square flex-shrink-0 shadow-2xl shadow-black/80 rounded-lg overflow-hidden group relative">
            {playlist.image ? (
              <img
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                src={playlist.image}
                alt={playlist.name}
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-neutral-500">
                  queue_music
                </span>
              </div>
            )}

            {/* Hover play overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl!">
                play_circle
              </span>
            </div>
          </div>

          {/* Text metadata */}
          <div className="flex-1 space-y-7!">
            <span className="text-[16px] font-bold uppercase tracking-[2px] text-[rgb(208_149_255/1)]">
              Playlist
            </span>

            <h2 className="text-5xl md:text-8xl font-black tracking-tighter -ml-1 leading-none">
              {playlist.name}
            </h2>

            {playlist.description && (
              <p
                className="text-on-surface-variant max-w-2xl font-medium"
                dangerouslySetInnerHTML={{ __html: playlist.description }}
              />
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
              {/* Branding pill */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-fixed text-xs font-bold">
                    bolt
                  </span>
                </div>
                <span className="font-bold text-sm">Music_Muse</span>
              </div>

              <span className="text-[14px] font-jakarta font-medium text-neutral-400">
                • {songs.length} {songs.length === 1 ? "song" : "songs"},&nbsp;
                <span className="text-white">{durationLabel}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <section className="px-8! py-8! flex items-center space-x-8! sticky top-[72px] bg-background/80 backdrop-blur-md z-30">

        {/* Play / Pause */}
        <button
          onClick={() => songs.length && handlePlaySong(songs[0])}
          className="sonic-pulse-hover w-16 h-16 bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] rounded-full flex items-center justify-center text-on-primary-fixed shadow-xl shadow-primary/20 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {playlistIsActive && isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* Like */}
        <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl">favorite</span>
        </button>

        {/* More */}
        <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl">more_horiz</span>
        </button>
      </section>

      {/* ── Track list ────────────────────────────────────────────────────── */}
      <section className="px-8!">

        {/* Column header */}
        <div className="grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4! py-3! border-b border-white/10 text-neutral-500 font-label text-[10px] uppercase tracking-[0.1em] mb-4!">
          <div>#</div>
          <div>Title</div>
          <div className="hidden sm:block">Album</div>
          <div className="hidden lg:block">Date Added</div>
          <div className="text-right flex justify-end items-center">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-1!">
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id;
            const isCurrentlyPlaying = isCurrentSong && isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song)}
                onMouseEnter={() => setHoveredRow(song.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4! py-3! items-center rounded-lg transition-all group cursor-pointer ${
                  isCurrentSong
                    ? "bg-primary/10"
                    : "hover:bg-surface-container"
                }`}
              >
                {/* Index / play icon */}
                <div className="relative w-4 text-[14px] font-medium">
                  {isCurrentlyPlaying ? (
                    /* Animated equalizer bars when playing */
                    <span
                      className="material-symbols-outlined text-primary text-[14px] flex items-center"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      graphic_eq
                    </span>
                  ) : (
                    <>
                      <span
                        className={`transition duration-100 ${
                          hoveredRow === song.id ? "opacity-0" : "opacity-100"
                        } ${isCurrentSong ? "text-primary" : "text-[#D095FF]"}`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`absolute inset-0 transition duration-200 material-symbols-outlined text-[14px] flex items-center justify-center ${
                          hoveredRow === song.id ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </>
                  )}
                </div>

                {/* Title + artist */}
                <div className="flex items-center space-x-4!">
                  <div className="w-10 h-10 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                    {song.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={song.image}
                        alt={song.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-neutral-600 text-sm">
                          music_note
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1">
                      <h4
                        className={`font-semibold font-Jakarta truncate group-hover:text-primary transition ${
                          isCurrentSong ? "text-primary" : "text-[#D095FF]"
                        }`}
                      >
                        {song.title}
                      </h4>
                      {song.explicit && <ExplicitBadge />}
                    </div>
                    <p className="text-sm text-neutral-300 truncate">
                      {song.artist?.name || song.artist || "Unknown Artist"}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden sm:block text-sm text-neutral-400 truncate">
                  {song.album || "—"}
                </div>

                {/* Date added */}
                <div className="hidden lg:block text-sm text-neutral-400">
                  {formatDateAdded(song.date_added)}
                </div>

                {/* Duration */}
                <div className="text-right text-sm text-neutral-400">
                  {formatDuration(song.duration)}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {songs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-500">
              <span className="material-symbols-outlined text-5xl">
                music_off
              </span>
              <p className="text-sm font-medium">This playlist is empty</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PlaylistDetail;