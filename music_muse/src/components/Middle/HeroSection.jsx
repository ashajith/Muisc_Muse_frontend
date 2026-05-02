import { useRef, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import { IoIosPlayCircle, IoMdPlay } from "react-icons/io";
import { gsap } from 'gsap';
import { Link } from "react-router-dom";
import '../../styles/MagicBento.css';
import heroImage from "../../assets/img/hero.webp";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

/* =========================
   PARTICLE + UTIL FUNCTIONS
========================= */

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(${color}, 1);
        box-shadow: 0 0 6px rgba(${color}, 0.6);
        pointer-events: none;
        z-index: 100;
        left: ${x}px;
        top: ${y}px;
    `;
    return el;
};

const calculateSpotlightValues = radius => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glow.toString());
    card.style.setProperty('--glow-radius', `${radius}px`);
};

/* =========================
   PARTICLE CARD
========================= */

const ParticleCard = ({ children, className = '', disableAnimations = false, style }) => {
    const cardRef = useRef(null);

    return (
        <div
            ref={cardRef}
            className={`${className} particle-container`}
            style={{ ...style, position: 'relative', overflow: 'hidden' }}
        >
            {children}
        </div>
    );
};

/* =========================
   GRID
========================= */

const BentoCardGrid = ({ children, gridRef }) => (
    <div ref={gridRef} className="grid grid-cols-12 gap-6 bento-section">
        {children}
    </div>
);

/* =========================
   MOBILE DETECTION
========================= */

const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

/* =========================
   MAIN COMPONENT
========================= */

const MagicBento = () => {
    const gridRef = useRef(null);
    const isMobile = useMobileDetection();

    const [trendingSongs, setTrendingSongs] = useState([]);

    /* =========================
       FETCH FROM BACKEND
    ========================= */

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get(
                    ("http://127.0.0.1:8000/api/spotify/trending/")
                );
                setTrendingSongs(res.data);
            } catch (err) {
                console.error("Error fetching trending songs:", err);
            }
        };

        fetchTrending();
    }, []);

    /* =========================
       UI
    ========================= */

    return (
        <BentoCardGrid gridRef={gridRef}>

            {/* LEFT BIG CARD */}
            <div className="col-span-12 lg:col-span-8">
                <ParticleCard className="hero-card">

                    <img src={heroImage} className="hero-image" />

                    <div className="hero-overlay" />

                    <div className="hero-content">

                        <span className="hero-tag">
                            Editorial Pick
                        </span>

                        <h1 className="hero-title">
                            Melodic Resonance: The 2026 Collection
                        </h1>

                        <p className="hero-desc">
                            Discover the sounds defining the next generation of electronic music curation.
                        </p>

                        <div className="hero-actions">

                            <button className="hero-btn-primary">
                                <span className="play-btn-hero">
                                    <IoMdPlay size={18} />
                                </span>
                                Play Now
                            </button>

                            <button className="hero-btn-glass">
                                <span className="material-symbols-outlined">
                                    add
                                </span>
                            </button>

                        </div>
                    </div>

                </ParticleCard>
            </div>

            {/* RIGHT SMALL CARD */}
            <div className="col-span-12 lg:col-span-4 h-full">
                <ParticleCard className="magic-bento-card chart-card h-full p-8 flex flex-col justify-between">

                    <div>
                        <h2 className="Heading-right">
                            Rising This Week
                        </h2>

                        <div className="space-y-4 overflow-y-scroll max-h-75 pr-2">

                            {trendingSongs.map((item, index) => (
                                <div key={item.id || index} className="chart-item group">

                                    <span className="chart-rank">{index + 1}</span>

                                    <img
                                        src={item.cover_image}
                                        className="chart-img"
                                    />

                                    <div className="flex-1">
                                        <p className="chart-title">{item.title}</p>
                                        <p className="chart-artist">{item.artist}</p>
                                    </div>

                                    <span className="chart-play">
                                        <IoIosPlayCircle />
                                    </span>

                                </div>
                            ))}

                        </div>
                    </div>

                    <Link to="/charts" className="chart-cta">
                        <span className="cta-text">View All Charts</span>
                        <span className="material-symbols-outlined icon-arrow">
                            arrow_forward
                        </span>
                    </Link>

                </ParticleCard>
            </div>

        </BentoCardGrid>
    );
};

export default MagicBento;