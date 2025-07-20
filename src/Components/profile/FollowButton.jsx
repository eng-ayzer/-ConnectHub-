import React from "react";

function FollowButton({ isFollowing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded text-sm ${
        isFollowing
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } transition`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
