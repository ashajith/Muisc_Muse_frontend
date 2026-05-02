import { useState } from "react";
import logo from "../assets/img/logo.png"
import "../styles/sidebar.css"

const Sidebar = () => {
  const [active, setActive] = useState("Discover");

  const menu = [
    { name: "Discover", icon: "explore" },
    { name: "Library", icon: "library_music" },
    { name: "Collections", icon: "subscriptions" },
    { name: "Curations", icon: "auto_awesome" },
  ];

  const bottomMenu = [
    { name: "Settings", icon: "settings" },
    { name: "Help", icon: "help" },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO (ADDED HERE) */}
      <div className="flex items-center gap-2.5 border-white/10 mb-5!">
        <img className="mt-1.25! w-17.5 h-15 ml-5" src={logo} alt="logo" />
        <span className="nav-head ml-2.5">MUSIC_MUSE</span>
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`sidebar-item ${active === item.name ? "active" : ""
              }`}
          >
            <span className="material-symbols-outlined icon">
              {item.icon}
            </span>
            <span className="label"><a href="#">{item.name}</a></span>
          </div>
        ))}
      </div>

      {/* PREMIUM */}
      <div class="premium-btn">
        <button class="w-full rounded-lg brand-gradient-bg transition-all hover:opacity-90 active:scale-95">
          Upgrade to Premium
        </button>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col bottom-button">
        {bottomMenu.map((item) => (
          <div
            key={item.name}
            className="sidebar-item"
          >
            <span className="material-symbols-outlined icon">
              {item.icon}
            </span>

            <span className="label">
              {item.name}
            </span>
          </div>
        ))}
      </div>

    </aside>
  );
};

export default Sidebar;