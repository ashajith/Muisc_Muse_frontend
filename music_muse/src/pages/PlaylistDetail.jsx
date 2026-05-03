import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistSongs } from "../services/spotify";
import usePlayerStore from "../store/playerStore";
import Layout from "../components/Layout";
import "../styles/playlist_detail.css"

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
      <section className="relative pt-24! pb-12! px-8! overflow-hidden bg-[linear-gradient(90deg,#3F2F4A_0%,#151318_45%,#2A304A_100%)]">

        {/* Glow Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 blur-[100px] pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary rounded-full"></div>
          <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-tertiary rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-8 relative z-10">

          {/* IMAGE */}
          <div className="w-full md:w-72 aspect-square flex-shrink-0 shadow-2xl shadow-black/80 rounded-lg overflow-hidden group relative">
            <img
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCusQ8w9PYWHT0LcDD1s3h-7vzUhI5g7QawpQ73XOWZO9xCqJ4KVDhr_3OwLt7mJ3pyqQtDe_4Sql1eD2PiK5RoIRrMSYvOcFFSMZ79UzV8Uvq0F-h2Urh_SWzAFSpna9cf2dCJd679aXYjIi85OLkeMxcczvf8igsHI7tINo7yiimNGU-49PgGy8DrrUFHcAvMFYoyCueTOrrFH7C6o4DcHul7S4pdU0CM_UMO4rfOOo9PmqyYGtOCIHxobH8G9re_pm-AQx2N6Zo"
              alt="playlist"
            />

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl!">
                play_circle
              </span>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 space-y-7!">
            <span className="text-[16px] font-bold uppercase tracking-[2px] text-[rgb(208_149_255/1)]">
              Playlist
            </span>

            <h2 className="text-5xl md:text-8xl font-black tracking-tighter -ml-1 leading-none">
              Punjabi 101
            </h2>

            <p className="text-on-surface-variant max-w-2xl font-medium">
              The ultimate collection of Punjabi hits featuring Sidhu Moose Wala,
              Diljit Dosanjh, and the hottest sounds from the scene.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-fixed text-xs font-bold">
                    bolt
                  </span>
                </div>
                <span className="font-bold text-sm">Music_Muse</span>
              </div>

              <span className="text-[14px] font-jakarta font-medium text-neutral-400">
                • 1,425,092 likes
              </span>

              <span className="text-[14px] font-jakarta font-medium text-neutral-400">
                • 50 songs,  <span className="text-[rgb(255_255_255/1)]"> 2 hr 45 min</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8! py-8! flex items-center space-x-8! sticky top-[72px] bg-background/80 backdrop-blur-md z-30">

        {/* PLAY BUTTON */}
        <button onClick={() => songs.length && handlePlaySong(songs[0])} className="sonic-pulse-hover w-16 h-16 bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] rounded-full flex items-center justify-center text-on-primary-fixed shadow-xl shadow-primary/20 cursor-pointer">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {playlistIsActive && isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* LIKE BUTTON */}
        <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl">
            favorite
          </span>
        </button>

        {/* MORE BUTTON */}
        <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl">
            more_horiz
          </span>
        </button>

      </section>

      <section className="px-8!">

        {/* HEADER */}
        <div className="grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4! py-3! border-b border-white/10 text-neutral-500 font-label text-[10px] uppercase tracking-[0.1em] mb-4!">
          
          <div>#</div>
          <div>Title</div>
          <div className="hidden sm:block">Album</div>
          <div className="hidden lg:block">Date Added</div>
          <div className="text-right flex justify-end items-center">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        </div>

        <div className="space-y-1!">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="grid grid-cols-[16px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-4 px-4! py-3! items-center rounded-lg hover:bg-surface-container transition-all group cursor-pointer"
            >
              {/* INDEX → PLAY ICON */}
              <div className="relative w-4 text-[14px] font-medium text-[#D095FF]">
                <span className="group-hover:opacity-0 transition duration-100">
                  {num}
                </span>

                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-200 material-symbols-outlined text-[14px] flex items-center justify-center"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </div>

              {/* TITLE */}
              <div className="flex items-center space-x-4!">
                <div className="w-10 h-10 bg-neutral-800 rounded overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZLwMpEWjTnH3wm0oLGB_OjHTrz1MOu3kvOPmY-ZtP9xkMaAPY1KiG4fyIwN1xTXxQELZcXX4ipKhxKCVvkp5gxEU_bSAQFiCudfY_okDr9FYi5cIJbvy0vht0FW5Vy0MsAQpF7iZ5p7btJL6osGp-WsEDMR8OilbK3Z0DP3xQ32frGh6SesyKLuQLrGIqfydXhkyOCeobYka9_zyJq2L01n9-SGKIOdJ0G2KRnxEwJvNfdjEICL85qCK95M3Dr5d-_nGILQBJ1XY"
                    alt="track"
                  />
                </div>

                <div className="overflow-hidden">
                  <h4 className="font-semibold text-[#D095FF] font-Jakarta truncate group-hover:text-primary transition">
                    Track {num}
                  </h4>
                  <p className="text-sm text-neutral-300 truncate">
                    Artist Name
                  </p>
                </div>
              </div>

              {/* ALBUM */}
              <div className="hidden sm:block text-sm text-neutral-400 truncate">
                Album Name
              </div>

              {/* DATE */}
              <div className="hidden lg:block text-sm text-neutral-400">
                2 days ago
              </div>

              {/* DURATION */}
              <div className="text-right text-sm text-neutral-400">
                3:12
              </div>
            </div>
          ))}
        </div>
      </section>

    </Layout>
  );
};

export default PlaylistDetail;