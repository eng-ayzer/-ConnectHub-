
import React from 'react';
import defaultAvatar from "../assets/defaultimage.png";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full sm:w-[48%]">
      <div className="flex items-start space-x-4">
        <img
          src={user.image || defaultAvatar}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover border-3 border-blue-200 shadow-md hover:shadow-lg transition-all duration-200"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-sm mt-1 text-gray-600">{user.bio}</p>
          <div className="text-xs text-gray-500 mt-2">
            <span>{user.followers} followers</span>{" "}
            <span className="ml-2">{user.following} following</span>
          </div>
        </div>
        <button 
          className={`text-sm px-3 py-1 rounded transition-colors ${
            user.isFollowing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
