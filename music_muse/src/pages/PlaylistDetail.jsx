import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistSongs } from "../services/spotify";
import usePlayerStore from "../store/playerStore";
import Layout from "../components/Layout";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  const { currentSong, isPlaying, playSong, togglePlay } =
    usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlaylistSongs(id);
        setPlaylist(data.playlist);
        setSongs(data.songs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlaySong = useCallback(
    (song) => {
      if (currentSong?.id === song.id) togglePlay();
      else playSong(song, songs);
    },
    [currentSong, songs, playSong, togglePlay]
  );

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

  const totalDuration = songs.reduce((a, s) => a + (s.duration || 0), 0);
  const totalHr = Math.floor(totalDuration / 3600);
  const totalMin = Math.floor((totalDuration % 3600) / 60);

  const playlistIsActive = songs.some((s) => s.id === currentSong?.id);

  if (loading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center text-neutral-400">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-white pb-10">

        {/* HERO */}
        <section className="relative pt-24 pb-12 px-10 overflow-hidden mt-[80px]!">

          <div className="absolute inset-0 -z-10 opacity-30 blur-[120px] pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-purple-600 rounded-full"></div>
            <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-indigo-500 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-8">

            {/* COVER */}
            <div className="w-full md:w-72 aspect-square shadow-2xl shadow-black/80 rounded-lg overflow-hidden group relative">
              <img
                src={playlist?.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button onClick={() => handlePlaySong(songs[0])}>
                  <span className="material-symbols-outlined text-white text-6xl">
                    play_circle
                  </span>
                </button>
              </div>
            </div>

            {/* META */}
            <div className="flex-1 space-y-4">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                Playlist
              </span>

              <h1 className="text-5xl md:text-8xl font-black leading-none">
                {playlist?.name}
              </h1>

              <p className="text-neutral-400 max-w-2xl">
                {playlist?.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-neutral-400">
                <span className="text-white font-semibold">Music Muse</span>
                <span>• {songs.length} songs</span>
                <span>
                  • {totalHr > 0
                    ? `${totalHr} hr ${totalMin} min`
                    : `${totalMin} min`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="px-10 py-6 flex items-center gap-6 sticky top-[72px] bg-black/80 backdrop-blur-md z-30">

          <button
            onClick={() => songs.length && handlePlaySong(songs[0])}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            <span className="material-symbols-outlined text-4xl text-white">
              {playlistIsActive && isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>

          <button className="text-neutral-400 hover:text-purple-400">
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </button>

          <button className="text-neutral-400 hover:text-purple-400">
            <span className="material-symbols-outlined text-3xl">more_horiz</span>
          </button>
        </section>

        {/* TRACK TABLE */}
        <section className="px-10">

          <div className="grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-3 border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-widest mb-4">
            <div>#</div>
            <div>Title</div>
            <div className="hidden sm:block">Album</div>
            <div className="hidden lg:block">Date Added</div>
            <div className="text-right">⏱</div>
          </div>

          <div className="space-y-1">
            {songs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              const isHovered = hoveredRow === song.id;

              return (
                <div
                  key={song.id}
                  onMouseEnter={() => setHoveredRow(song.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onDoubleClick={() => handlePlaySong(song)}
                  className="grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4 py-3 items-center rounded-lg hover:bg-white/5 group"
                >

                  <div className={`text-sm ${isActive ? "text-purple-400 font-bold" : "text-neutral-500"}`}>
                    <span className="group-hover:hidden">{i + 1}</span>
                    <span className="hidden group-hover:block material-symbols-outlined text-sm">
                      play_arrow
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={song.image || playlist?.image}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="overflow-hidden">
                      <h4 className={`truncate ${isActive ? "text-purple-400" : ""}`}>
                        {song.title}
                      </h4>
                      <p className="text-neutral-400 text-sm truncate">
                        {song.artist?.name || song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block text-neutral-400 text-sm truncate">
                    {song.album}
                  </div>

                  <div className="hidden lg:block text-neutral-400 text-sm">
                    {formatDateAdded(song.date_added)}
                  </div>

                  <div className="text-right text-neutral-400 text-sm">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PlaylistDetail;