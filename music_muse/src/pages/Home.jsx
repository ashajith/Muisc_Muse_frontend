import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Middle from "../components/Middle";
import Playbar from "../components/Playbar";

function Home() {
  return (
    <div className="h-screen bg-[#111111] text-white flex flex-col">

      {/* NAVBAR */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 bg-[#05050a]">

        {/* SIDEBAR */}
        <div className="w-64 shrink-0 border-r border-white/10">
          <Sidebar />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto mt-5">
          <div className="px-6 lg:px-10 py-6 pb-28!">
            <Middle />
          </div>
        </div>
      </div>

      {/* PLAYBAR */}
      <div className="shrink-0">
        <Playbar />
      </div>

    </div>
  );
}

export default Home;