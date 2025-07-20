import React from "react";
import { Home, Search, Plus, Bell, User, Info  } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `flex flex-col items-center justify-center text-sm ${
      location.pathname === path
        ? "text-blue-600"
        : "text-gray-500 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around md:hidden z-50">
      <Link to="/" className={linkClass("/") + " py-2"}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/search" className={linkClass("/search") + " py-2"}>
        <Search size={20} />
        <span>Search</span>
      </Link>
      <Link to="/create-post" className={linkClass("/create-post") + " py-2"}>
        <Plus size={20} />
        <span>Create</span>
      </Link>
      {/* <Link to="/notifications" className={linkClass("/notifications") + " py-2"}>
        <Bell size={20} />
        <span>Alerts</span>
      </Link> */}
      <Link to="/profile" className={linkClass("/profile") + " py-2"}>
        <User size={20} />
        <span>Profile</span>
         </Link>

      <Link to="/about" className={linkClass("/about") + " py-2"}>
        <Info size={20} />
        <span>About</span>
      </Link>

     
    </nav>
  );
};

export default BottomNav;
