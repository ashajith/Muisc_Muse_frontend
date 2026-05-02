import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Playbar from "./Playbar";

const Layout = ({ children }) => {
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

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>

      {/* PLAYBAR */}
      <div className="shrink-0">
        <Playbar />
      </div>

    </div>
  );
};

export default Layout;