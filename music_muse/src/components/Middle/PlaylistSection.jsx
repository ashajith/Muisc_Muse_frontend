import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/playlist.css";
import { getPlaylists } from "../../services/spotify";

const PlaylistSection = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch (err) {
        console.error("Error fetching playlists", err);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <section className="mb-14 mt-12.5!">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="heading text-3xl font-extrabold text-white tracking-tight">
            Featured Playlists
          </h2>
          <p className="subtext text-neutral-400 mt-1">
            Hand-picked selections for your every mood.
          </p>
        </div>
        <button className="cursor-pointer subtext-one text-neutral-400 hover:text-white transition font-semibold text-xs uppercase tracking-widest">
          See all
        </button>
      </div>

      <div className="mt-7.5! grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {playlists.map((item, i) => (
          <div
            key={i}
            className="playlist-card group cursor-pointer"
            onClick={() => navigate(`/playlist/${item.id}`)}
          >
            <div className="playlist-image-wrapper">
              <img src={item.image} alt={item.name} />
              <div className="overlay">
                <button
                  className="play-btn cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double navigation
                    navigate(`/playlist/${item.id}`);
                  }}
                >
                  <span className="material-symbols-outlined text-white">
                    play_arrow
                  </span>
                </button>
              </div>
            </div>
            <h4>{item.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlaylistSection;