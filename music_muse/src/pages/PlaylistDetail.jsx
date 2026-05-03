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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl">
                play_circle
              </span>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
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
                  <span className="material-symbols-outlined text-xs">
                    bolt
                  </span>
                </div>
                <span className="font-bold text-sm">Electric Sonic</span>
              </div>

              <span className="text-sm text-neutral-400">
                • 1,425,092 likes
              </span>

              <span className="text-sm text-neutral-400">
                • 50 songs, <span className="text-white">2 hr 45 min</span>
              </span>
            </div>
          </div>
        </div>
      </section>



    </Layout>
  );
};

export default PlaylistDetail;