import { Home, Search, Plus, Bell, Info, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "../../store/Slices/AuthSlices";
import defaultAvatar from "../../assets/defaultimage.png";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  console.log("User in Sidebar:", user);
  console.log("User avatar URL in Sidebar:", user?.avatarUrl);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, user?.id]);

  const linkClass = (path) =>
    `flex items-center space-x-3 p-2 rounded ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-100 text-gray-700"
    }`;

  return (
    <nav className="hidden md:flex fixed top-16 left-0 h-screen w-48 flex-col space-y-4 p-4 bg-white shadow-md overflow-y-auto">
      {/* User Profile Section */}
      {user && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg" key={`user-${user.id}-${user.avatarUrl}`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              {imageLoading && (
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={user.avatarUrl || defaultAvatar}
                alt="Profile"
                className={`w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-200 ${
                  imageLoading ? 'hidden' : 'block'
                }`}
                onLoad={() => {
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={(e) => {
                  e.target.src = defaultAvatar;
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">@{user.username || "user"}</p>
            </div>
          </div>
        </div>
      )}

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
      <Link to="/notifications" className={linkClass("/notifications")}>
        <Bell />
        <span>Notifications</span>
      </Link>
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
