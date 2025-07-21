
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full sm:w-[48%]">
      <div className="flex items-start space-x-4">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
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
        <button className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300">
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
