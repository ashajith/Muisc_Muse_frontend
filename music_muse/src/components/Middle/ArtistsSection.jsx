import { useEffect, useState, useRef } from "react";
import "../../styles/artist.css"
import { getArtists } from "../../services/spotify";

const ArtistsSection = () => {
  const [artists, setArtists] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (err) {
        console.error("Error fetching artists", err);
      }
    };

    fetchArtists();
  }, []);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
  }, [artists]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 320;
    el.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
    // Update scroll state after animation
    setTimeout(checkScrollability, 350);
  };

  return (
    <section className="mb-14 artist-section">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="heading text-3xl font-extrabold text-white tracking-tight">
            Popular artists
          </h2>
          <p className="subtext text-neutral-400 mt-1">
            Inspired by your recent listening.
          </p>
        </div>

        {/* <button className="cursor-pointer subtext-one text-neutral-400 hover:text-white transition font-semibold text-xs uppercase tracking-widest">
          Show all
        </button> */}
      </div>

      {/* SCROLLABLE GRID WRAPPER */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LEFT ARROW */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: "-16px",
              top: "50%",
              transform: "translateY(-60%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#282828",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease, background-color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3e3e3e"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#282828"}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>
              chevron_left
            </span>
          </button>
        )}

        {/* RIGHT ARROW */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: "-16px",
              top: "50%",
              transform: "translateY(-60%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#282828",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease, background-color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3e3e3e"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#282828"}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>
              chevron_right
            </span>
          </button>
        )}

        {/* SCROLLABLE ROW */}
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollbarWidth: "none",       /* Firefox */
            msOverflowStyle: "none",      /* IE/Edge */
            paddingBottom: "8px",
          }}
        >
          {/* Hide scrollbar for WebKit */}
          <style>{`
            .artist-scroll-row::-webkit-scrollbar { display: none; }
          `}</style>

          {artists.map((artist, index) => (
            <div
              key={index}
              className="group text-center cursor-pointer"
              style={{ flex: "0 0 auto", width: "calc((100% - 5 * 24px) / 6)" }}
            >
              <div className="relative mb-4 flex justify-center">
                {/* IMAGE */}
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="artist-avatar"
                />

                {/* PLAY BUTTON */}
                <button className="play-btn">
                  <span className="material-symbols-outlined text-white text-2xl">
                    play_arrow
                  </span>
                </button>
              </div>

              <h4 className="text-white font-semibold text-sm">
                {artist.name}
              </h4>
              <p className="text-neutral-500 text-xs mt-1">Artist</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;