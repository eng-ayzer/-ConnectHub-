import { Home, Search, Plus, Bell, Info, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center space-x-3 p-2 rounded ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-100 text-gray-700"
    }`;

  return (
    <nav className="hidden md:flex fixed top-16 left-0 h-screen w-48 flex-col space-y-4 p-4 bg-white shadow-md overflow-y-auto">
      <Link to="/" className={linkClass("/")}>
        <Home />
        <span>Home</span>
      </Link>
      <Link to="/search" className={linkClass("/search")}>
        <Search />
        <span>Search</span>
      </Link>
      <Link to="/create-post" className={linkClass("/create")}>
        <Plus />
        <span>Create</span>
      </Link>
      {/* <Link to="/notifications" className={linkClass("/notifications")}>
        <Bell />
        <span>Notifications</span>
      </Link> */}
      <Link to="/profile" className={linkClass("/profile")}>
        <User />
        <span>Profile</span>
      </Link>

      <Link to="/about" className={linkClass("/about")} >
        <Info />
        <span>About</span>
      </Link>  

    </nav>
  );
};

export default Sidebar;
