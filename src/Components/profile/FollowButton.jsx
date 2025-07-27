import React from "react";

function FollowButton({ isFollowing, onToggle, isLoading = false }) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded text-sm transition ${
        isLoading
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : isFollowing
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
