import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchUserProfile,
  fetchMyProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
} from "../store/Slices/profileSlice";

import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import PostCard from "../components/posts/Postcard";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
import EditableField from "../components/profile/EditField";
import FollowButton from "../components/profile/FollowButton";
import defaultpic from "../assets/defaultimage.png";
import { formatName } from "../components/utils/formatName";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { id: routeId } = useParams();

  const { myProfile, profileUser, status, error } = useSelector((state) => state.profile);

  const isOwnProfile = !routeId || myProfile?._id === routeId;
  const userToShow = isOwnProfile ? myProfile : profileUser;
  const isFollowing = profileUser?.isFollowing;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [publicId, setPublicId] = useState("");

  const cloudName = "doa9xmvsa";
  const uploadPreset = "connecthub";

  const uwConfig = {
    cloudName,
    uploadPreset,
    folder: "avatars",
    cropping: true,
    multiple: false,
  };

  useEffect(() => {
    routeId ? dispatch(fetchUserProfile(routeId)) : dispatch(fetchMyProfile());
  }, [dispatch, routeId]);

  useEffect(() => {
    if (userToShow) {
      setFormData({
        name: userToShow.name || "",
        bio: userToShow.bio || "",
      });
    }
  }, [userToShow]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveAll = () => {
    const payload = {
      ...formData,
      ...(publicId && {
        avatarUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.jpg`,
      }),
    };

    dispatch(updateUserProfile(payload)).then(() => {
      dispatch(fetchMyProfile());
      setIsEditing(false);
      setPublicId("");
    });
  };

  const handleFollowToggle = () => {
    if (!profileUser?._id || isOwnProfile) return;
    dispatch(isFollowing ? unfollowUser(profileUser._id) : followUser(profileUser._id));
  };

  const avatarSrc = publicId
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.jpg`
    : userToShow?.avatarUrl || defaultpic;

  if (!userToShow || status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Sidebar />
     <main className="w-full px-4 py-8 max-w-7xl mx-auto lg:ml-48">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap w-full">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-4 border-grey shadow-md transition-all duration-300"
              />
              {isOwnProfile && (
                <div className="mt-2">
                  <CloudinaryUploadWidget
                    uwConfig={uwConfig}
                    setPublicId={setPublicId}
                    setUploadResult={() => {}}
                  />
                </div>
              )}
            </div>
             {/* Name section*/}

            <div className="flex-1 justify-center w-full">
              {isEditing ? (
              <EditableField
              label=""
                name="name"
                value={formData.name}
                isEditing={isEditing}
                onChange={handleInputChange}
              /> 
              ):(
              <h1 className="text-xl sm:text-2xl font-bold text-white">{formatName(formData.name ||userToShow.name)}

              </h1>
              )}
            </div>
            </div>

            {!isOwnProfile && (
              <FollowButton isFollowing={isFollowing} onToggle={handleFollowToggle} />
            )}
          </div>
        </section>

         {/* Save Button */}
          {isOwnProfile && (
            <div className="flex justify-end mt-6">
            <button
              onClick={isEditing ? handleSaveAll : () => setIsEditing(true)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
            </div>
          )}

        {/* Bio */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <EditableField
            label="Bio"
            name="bio"
            value={formData.bio}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <p className="text-sm text-gray-500 mt-2">
            Joined: {new Date(userToShow.createdAt).toLocaleDateString()}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
            <div className="bg-gray-50 py-2 rounded-md hover:bg-gray-100">
              <p className="text-lg font-semibold">{userToShow.followersCount ?? 0}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="bg-gray-50 py-2 rounded-md hover:bg-gray-100">
              <p className="text-lg font-semibold">{userToShow.followingCount ?? 0}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
            <div className="bg-gray-50 py-2 rounded-md hover:bg-gray-100">
              <p className="text-lg font-semibold">{userToShow.postsCount ?? 0}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
          </div>

         
        </section>

        {/* Posts */}
        <section className="space-y-6 w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold">Posts</h2>
          {error && <p className="text-red-600">{error}</p>}
          {userToShow.recentPosts?.length > 0 ? (
            userToShow.recentPosts.map((post) => (
              <PostCard
                key={post.id || post._id || post.createdAt}
                post={{
                  ...post,
                  user: {
                    name: userToShow.name,
                    avatarUrl: userToShow.avatarUrl,
                    id: userToShow._id || userToShow.id,
                  },
                }}
              />
            ))
          ) : (
            <p className="text-gray-600">No posts yet</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
