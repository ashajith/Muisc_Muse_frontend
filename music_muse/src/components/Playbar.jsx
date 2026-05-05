import { IoPlayCircle, IoPauseCircle } from "react-icons/io5";
import usePlayerStore from "../store/playerStore";
import "../styles/playerbar.css";

const fmt = (sec) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const Playbar = () => {
  const {
    currentSong, isPlaying, progress, duration, volume,
    shuffle, repeat, likedSongs, noPreview, isLoadingAudio,
    togglePlay, playNext, playPrev, seek, setVolume,
    toggleShuffle, cycleRepeat, toggleLike,
  } = usePlayerStore();

  if (!currentSong) return null;

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const isLiked = likedSongs.has(currentSong?.id);
  const repeatIcon = repeat === "one" ? "repeat_one" : "repeat";
  const repeatActive = repeat !== "none";
  const disabled = noPreview || isLoadingAudio;

  return (
    <div className="playerbar-container">

      {/* LEFT */}
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <img
          src={currentSong.image || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=60&h=60&fit=crop"}
          alt={currentSong.title}
          className="w-14 h-14 rounded-lg shadow-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-white font-bold text-sm hover:text-violet-400 cursor-pointer transition-colors truncate">
            {currentSong.title}
          </p>
          <p className="text-neutral-400 text-xs hover:text-white cursor-pointer transition-colors truncate">
            {currentSong.artist?.name || currentSong.artist || "Unknown Artist"}
          </p>
          {/* Status labels */}
          {isLoadingAudio && (
            <p className="text-[10px] text-violet-400 font-medium mt-0.5 animate-pulse">
              Loading audio…
            </p>
          )}
          {noPreview && !isLoadingAudio && (
            <p className="text-[10px] text-amber-400 font-medium mt-0.5">
              No audio available
            </p>
          )}
        </div>
        <button
          onClick={() => toggleLike(currentSong.id)}
          className={`ml-2 flex-shrink-0 cursor-pointer transition-colors ${
            isLiked ? "text-violet-400" : "text-neutral-500 hover:text-violet-400"
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">

          <button
            onClick={toggleShuffle}
            className={`cursor-pointer transition-colors ${
              shuffle ? "text-violet-400" : "text-neutral-500 hover:text-violet-400"
            }`}
          >
            <span className="material-symbols-outlined">shuffle</span>
          </button>

          <button
            onClick={playPrev}
            className="text-violet-400 cursor-pointer hover:text-white transition-all hover:scale-105 active:scale-90"
          >
            <span className="material-symbols-outlined">skip_previous</span>
          </button>

          {/* Play/Pause — shows spinner while loading */}
          <button
            onClick={togglePlay}
            disabled={disabled}
            className={`play-btns cursor-pointer transition-all ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}`}
          >
            {isLoadingAudio ? (
              <span className="material-symbols-outlined text-violet-400 animate-spin"
                style={{ fontSize: 48 }}>
                progress_activity
              </span>
            ) : isPlaying ? (
              <IoPauseCircle />
            ) : (
              <IoPlayCircle />
            )}
          </button>

          <button
            onClick={playNext}
            className="text-violet-400 cursor-pointer hover:text-white transition-all hover:scale-105 active:scale-90"
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>

          <button
            onClick={cycleRepeat}
            className={`cursor-pointer transition-colors relative ${
              repeatActive ? "text-violet-400" : "text-neutral-500 hover:text-violet-400"
            }`}
          >
            <span className="material-symbols-outlined">{repeatIcon}</span>
            {repeatActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
            )}
          </button>
        </div>

        {/* Progress */}
        <div className="progress-wrapper">
          <span>{fmt(progress)}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              disabled={disabled}
            />
          </div>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        <div className="flex items-center gap-4">
          <button className="text-neutral-500 hover:text-violet-400 transition-colors scale-110">
            <span className="material-symbols-outlined music-icon">music_note</span>
          </button>
          <button className="text-neutral-500 hover:text-violet-400 transition-colors">
            <span className="material-symbols-outlined text-xl">queue_music</span>
          </button>
          <button className="text-neutral-500 hover:text-violet-400 transition-colors">
            <span className="material-symbols-outlined text-xl">computer</span>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-28">
          <span className="material-symbols-outlined text-neutral-500 leading-none translate-y-px">
            {volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
          </span>
          <div className="custom-progress-wrapper">
            <div className="custom-progress-bar group">
              <div
                className="custom-progress-fill"
                style={{
                  width: `${volume * 100}%`,
                  background: "linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)",
                }}
              >
                <div className="custom-progress-thumb" />
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
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