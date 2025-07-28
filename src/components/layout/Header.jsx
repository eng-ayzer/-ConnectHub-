import React, { useState } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./LogouButton.jsx";
import defaultpic from "../../assets/defaultimage.png";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <header className="flex justify-between items-center bg-white shadow-md fixed w-full p-4 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold rounded ">
          C
        </div>
        {/* Title */}
        <h1 className="text-xl font-bold ">ConnectHub</h1>
      </div>

      {/* User Info & Logout */}
      {isAuthenticated && (
        <div className="flex items-center space-x-3 text-gray-700 font-semibold">
          {/* User avatar */}
          <div className="relative">
            {imageLoading && (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={user?.avatarUrl || defaultpic}
              alt="User avatar"
              className={`w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow ${
                imageLoading ? 'hidden' : 'block'
              }`}
              onLoad={() => {
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(e) => {
                e.target.src = defaultpic;
                setImageLoading(false);
                setImageError(true);
              }}
            />
          </div>
          <span>{user?.name || "User"}</span>

          {/* Logout button */}
          <LogoutButton />
        </div>
      )}
    </header>
  );
};

export default Header;
