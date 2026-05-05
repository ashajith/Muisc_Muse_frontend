import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Playbar from "./Playbar";
import usePlayerStore from "../store/playerStore";

const Layout = ({ children }) => {
  const currentSong = usePlayerStore((s) => s.currentSong);

  return (
    <div className="h-screen bg-[#111111] text-white flex flex-col">

      {/* NAVBAR */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* MAIN */}
      <div className="flex flex-1 bg-[#05050a] overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-64 shrink-0 border-r border-white/10">
          <Sidebar />
        </div>

        {/* CONTENT — add bottom padding when playerbar is visible */}
        <div className={`flex-1 overflow-y-auto ${currentSong ? "pb-24" : ""}`}>
          {children}
        </div>

      </div>

      {/* PLAYBAR — fixed at bottom, only appears when a song is active */}
      <Playbar />

    </div>
  );
};

export default Layout;