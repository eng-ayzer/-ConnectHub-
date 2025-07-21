import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./LogouButton.jsx";
import defaultpic from "./defaultimage.png";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
          
          {/* User name */}
          <img
          src={user?.avatarUrl || "/default-avatar.png"}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
          <span>{user?.name || "User"}</span>

          {/* Logout button */}
          <LogoutButton />
        </div>
      )}
    </header>
  );
};

export default Header;
