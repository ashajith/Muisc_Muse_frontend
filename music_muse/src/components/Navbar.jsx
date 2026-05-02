import React, { useState } from "react";
// import logo from "../assets/img/logo.png"
import "../styles/navbar.css"
import { FaChevronLeft, FaChevronRight, FaBell, FaCog, } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Music");
  const tabs = ["Music", "Podcasts", "Live"];

  return (
    <nav className="fixed z-50 h-17 w-full flex items-center px-6 border-none bg-[#05050a]/80 backdrop-blur-md">

      {/* LEFT: Logo */}
      {/* <div className="relative z-50 flex items-center gap-2.5">
        <img className="w-17.5 h-15 ml-[20px]" src={logo} alt="" />
        <span className="nav-head ml-[10px]">MUSIC_MUSE</span>
      </div> */}

      {/* CENTER: Navigation */}
      <div className="flex items-center flex-1 justify-flex-start left-27.5 gap-6 relative z-10">

        {/* Arrows */}
        <div className="flex items-center gap-2 ml-45!">
          <button className="nav-arrows w-8 h-8 rounded-full flex items-center justify-center">
            <FaChevronLeft size={12} />
          </button>

          <button className="ml-2.5 nav-arrows w-8 h-8 rounded-full flex items-center justify-center">
            <FaChevronRight size={12} />
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs ml-7.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
              <span className="underline" />
            </button>
          ))}
        </div>

      </div>

      {/* RIGHT: Search + Icons */}
      <div className="flex items-center gap-2 justify-end mr-2.5! flex-1">

        {/* Search */}
        <div className="search-container">
          <span className="search-icon material-symbols-outlined">
            search
          </span>

          <input
            type="text"
            placeholder="Artists, songs, or podcasts"
            className="search-input"
          />
        </div>

        {/* Bell */}
        <button className="bell-btn rounded-[999px]">
          <span className="bell-icon material-symbols-outlined">
            notifications
          </span>

          <span className="notification-dot"></span>
        </button>

        {/* Settings */}
        <button className="settings-btn rounded-[999px]">
          <span className="settings-icon material-symbols-outlined">
            settings
          </span>
        </button>

      </div>
    </nav >
  );
};

export default Navbar;