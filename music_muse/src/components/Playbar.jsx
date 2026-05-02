import React, { useState } from "react";
import { IoPlayCircle, IoPauseCircle, IoPlaySkipBackSharp, IoPlaySkipForwardSharp, } from "react-icons/io5";
import {
  FaRandom,
  FaRedoAlt,
  FaHeart,
  FaVolumeUp,
  FaMusic,
  FaBars,
  FaTv,
} from "react-icons/fa";
import "../styles/playerbar.css";

const Playbar = () => {
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(60);
  const [volume, setVolume] = useState(75);

  return (
    <div className="playerbar-container">

      {/* LEFT */}
      <div className="flex items-center gap-4 w-1/3">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=60&h=60&fit=crop"
          alt="Now Playing"
          className="w-14 h-14 rounded-lg shadow-lg object-cover"
        />

        <div>
          <p className="text-white font-bold text-sm hover:text-violet-400 cursor-pointer transition-colors">
            Neon Dreams
          </p>
          <p className="text-neutral-400 text-xs hover:text-white cursor-pointer transition-colors">
            Vanguard Echo
          </p>
        </div>

        <button
          onClick={() => setLiked(prev => !prev)}
          className={`ml-2 cursor-pointer transition-colors ${liked ? "text-violet-400" : "text-neutral-500 hover:text-violet-400"
            }`}
        >
          <span className="material-symbols-outlined text-xl">
            {liked ? "favorite" : "favorite_border"}
          </span>
        </button>

      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center gap-2 w-1/3">

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button class="text-violet-400 cursor-pointer hover:text-white transition-colors">
            <span class="material-symbols-outlined" data-icon="shuffle">shuffle</span>
          </button>

          <button class="text-violet-400 cursor-pointer hover:text-white transition-all hover:scale-105 active:scale-90">
            <span class="material-symbols-outlined" data-icon="skip_previous">skip_previous</span>
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="play-btns cursor-pointer"
          >
            {playing ? (
              <IoPauseCircle />
            ) : (
              <IoPlayCircle />
            )}
          </button>

          <button class="text-violet-400 cursor-pointer hover:text-white transition-all hover:scale-105 active:scale-90">
            <span class="material-symbols-outlined" data-icon="skip_next">skip_next</span>
          </button>

          <button class="text-violet-400 cursor-pointer hover:text-white transition-colors">
            <span class="material-symbols-outlined" data-icon="repeat">repeat</span>
          </button>
        </div>

        {/* Progress */}
        <div className="progress-wrapper">
          <span>2:14</span>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </div>

          <span>3:45</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-6 w-1/3">

        <div className="flex items-center gap-4">
          <button class="text-neutral-500 hover:text-violet-400 transition-colors scale-110">
            <span class="material-symbols-outlined music-icon" data-icon="music_note">music_note</span>
          </button>

          <button class="text-neutral-500 hover:text-violet-400 transition-colors">
            <span class="material-symbols-outlined text-xl" data-icon="queue_music">queue_music</span>
          </button>

          <button class="text-neutral-500 hover:text-violet-400 transition-colors">
            <span class="material-symbols-outlined text-xl" data-icon="computer">computer</span>
          </button>

        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-28 group">

          {/* Icon */}
          <span className="material-symbols-outlined text-neutral-500 leading-none translate-y-px">
            volume_up
          </span>

          {/* Bar */}
          <div className="custom-progress-wrapper">
            <div className="custom-progress-bar group">

              {/* Fill */}
              <div
                className="custom-progress-fill"
                style={{
                  width: `${volume}%`,
                  background:
                    "linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)",
                }}
              >
                {/* Thumb */}
                <div className="custom-progress-thumb" />
              </div>

              {/* Input */}
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="custom-progress-input"
              />
            </div>
          </div>

        </div>

      </div>

    </div>

    
  );
};

export default Playbar;