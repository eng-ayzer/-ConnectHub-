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
import { checkAuthStatus } from "../store/Slices/AuthSlices";

import Sidebar from "../Components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import PostCard from "../Components/posts/Postcard";
import CloudinaryUploadWidget from "../Components/cloudinaryUploadWidget";
import EditableField from "../Components/profile/EditField";
import FollowButton from "../Components/profile/FollowButton";
import defaultpic from "../assets/defaultimage.png";
import { formatName } from "../Components/utils/formatName";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { id: routeId } = useParams();

  const { myProfile, profileUser, status, error } = useSelector((state) => state.profile);
  const { user: authUser } = useSelector((state) => state.auth);

  const isOwnProfile = !routeId || myProfile?._id === routeId;
  // Use auth user as fallback for own profile if profile data is not loaded yet
  const userToShow = isOwnProfile ? (myProfile || authUser) : profileUser;
  const isFollowing = profileUser?.isFollowing;

  // Debug logging
  console.log("ProfilePage Debug:", {
    routeId,
    myProfile,
    profileUser,
    status,
    error,
    isOwnProfile,
    userToShow
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [publicId, setPublicId] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

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
    // Only fetch if we don't have the data already
    if (routeId) {
      if (!profileUser || profileUser._id !== routeId) {
        dispatch(fetchUserProfile(routeId));
      }
    } else {
      if (!myProfile) {
        dispatch(fetchMyProfile());
      }
    }
  }, [dispatch, routeId, myProfile, profileUser]);

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

  const handleSaveProfilePicture = async () => {
    if (!publicId) return;
    
    const payload = {
      avatarUrl: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_300,h_300/${publicId}.jpg`,
    };

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      await dispatch(fetchMyProfile());
      // Force refresh user data in auth slice
      await dispatch(checkAuthStatus());
      setPublicId("");
      // Reset image loading to show the new image
      setImageLoading(true);
    } catch (error) {
      console.error("Failed to save profile picture:", error);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!userToShow?.avatarUrl) return;
    
    // Ask for confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to remove your profile picture? This action cannot be undone.");
    if (!confirmed) return;
    
    setIsDeleting(true);
    
    const payload = {
      avatarUrl: null, // Set to null to remove the profile picture
    };

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      await dispatch(fetchMyProfile());
      // Force refresh user data in auth slice
      await dispatch(checkAuthStatus());
      // Reset image loading to show the default image
      setImageLoading(true);
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveAll = async () => {
    const payload = {
      ...formData,
      ...(publicId && {
        avatarUrl: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_300,h_300/${publicId}.jpg`,
      }),
    };

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      await dispatch(fetchMyProfile());
      // Force refresh user data in auth slice
      await dispatch(checkAuthStatus());
      setIsEditing(false);
      setPublicId("");
      // Reset image loading to show the new image
      setImageLoading(true);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileUser?._id || isOwnProfile) return;
    setFollowLoading(true);
    try {
      await dispatch(isFollowing ? unfollowUser(profileUser._id) : followUser(profileUser._id)).unwrap();
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchFollowers = async () => {
    if (!userToShow?._id) return;
    setFollowersLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${userToShow._id}/followers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setFollowers(data);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    } finally {
      setFollowersLoading(false);
    }
  };

  const fetchFollowing = async () => {
    if (!userToShow?._id) return;
    setFollowingLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${userToShow._id}/following`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setFollowing(data);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setFollowingLoading(false);
    }
  };

  const handleShowFollowers = () => {
    setShowFollowers(true);
    fetchFollowers();
  };

  const handleShowFollowing = () => {
    setShowFollowing(true);
    fetchFollowing();
  };

  // Create the avatar source with proper Cloudinary URL
  const avatarSrc = publicId
    ? `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_300,h_300/${publicId}.jpg`
    : userToShow?.avatarUrl || defaultpic;

  // Reset image loading when avatar source changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [avatarSrc]);

  // Show loading only if we're actually loading and don't have any user data
  if (status === "loading" && !userToShow && !authUser) {
    return (
      <div className="flex flex-col lg:flex-row w-full">
        <Sidebar />
        <main className="w-full px-4 py-8 max-w-7xl mx-auto lg:ml-48">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error if there's an error and no user data
  if (status === "failed" && !userToShow && !authUser) {
    return (
      <div className="flex flex-col lg:flex-row w-full">
        <Sidebar />
        <main className="w-full px-4 py-8 max-w-7xl mx-auto lg:ml-48">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load profile</p>
              <button 
                onClick={() => routeId ? dispatch(fetchUserProfile(routeId)) : dispatch(fetchMyProfile())}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Safety check - don't render if no user data is available
  if (!userToShow && !authUser) {
    return (
      <div className="flex flex-col lg:flex-row w-full">
        <Sidebar />
        <main className="w-full px-4 py-8 max-w-7xl mx-auto lg:ml-48">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
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
              {imageLoading && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={avatarSrc}
                alt="Profile"
                className={`w-24 h-24 sm:w-28 sm:h-28 object-cover border-4 border-grey shadow-md transition-all duration-300 ${
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
              {isOwnProfile && (
                <div className="mt-2 space-y-2">
                  <CloudinaryUploadWidget
                    uwConfig={uwConfig}
                    setPublicId={(id) => {
                      setPublicId(id);
                      setIsUploading(false);
                      setFileSelected(false);
                    }}
                    setUploadResult={(result) => {
                      if (result && result.event === "source-changed") {
                        setFileSelected(true);
                        setIsUploading(true);
                      }
                    }}
                  />
                  
                  {/* Delete Profile Picture Button */}
                  {userToShow?.avatarUrl && userToShow.avatarUrl !== defaultpic && (
                    <button
                      onClick={handleDeleteProfilePicture}
                      disabled={status === "loading" || isDeleting}
                      className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove Profile Picture"
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove Photo</span>
                        </>
                      )}
                    </button>
                  )}
                  {fileSelected && isUploading && !publicId && (
                    <div className="mt-2 text-center">
                      <span className="text-sm text-blue-600 flex items-center justify-center gap-1">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing image...
                      </span>
                    </div>
                  )}
                  {publicId && !isUploading && (
                    <div className="mt-2 text-center">
                      <div className="mb-2">
                        <img
                          src={`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_100,h_100/${publicId}.jpg`}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-500 mx-auto"
                        />
                      </div>
                      <span className="text-sm text-green-600 flex items-center justify-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Image uploaded successfully!
                      </span>
                      <button
                        onClick={handleSaveProfilePicture}
                        disabled={status === "loading"}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {status === "loading" ? "Saving..." : "Save Profile Picture"}
                      </button>
                    </div>
                  )}
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
              <h1 className="text-xl sm:text-2xl font-bold text-white">{formatName(formData.name || userToShow?.name || "User")}

              </h1>
              )}
            </div>
            </div>

            {!isOwnProfile && (
              <FollowButton 
                isFollowing={isFollowing} 
                onToggle={handleFollowToggle} 
                isLoading={followLoading}
              />
            )}
          </div>
        </section>

         {/* Save Button */}
          {isOwnProfile && (
            <div className="flex justify-end mt-6">
            <button
              onClick={isEditing ? handleSaveAll : () => setIsEditing(true)}
              disabled={status === "loading"}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
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
            Joined: {userToShow?.createdAt ? new Date(userToShow.createdAt).toLocaleDateString() : "Unknown"}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
            <button 
              onClick={handleShowFollowers}
              className="bg-gray-50 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <p className="text-lg font-semibold">{userToShow?.followersCount ?? 0}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </button>
            <button 
              onClick={handleShowFollowing}
              className="bg-gray-50 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <p className="text-lg font-semibold">{userToShow?.followingCount ?? 0}</p>
              <p className="text-sm text-gray-600">Following</p>
            </button>
            <div className="bg-gray-50 py-2 rounded-md">
              <p className="text-lg font-semibold">{userToShow?.postsCount ?? 0}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
          </div>

         
        </section>

        {/* Posts */}
        <section className="space-y-6 w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold">Posts</h2>
          {error && <p className="text-red-600">{error}</p>}
          {userToShow?.recentPosts?.length > 0 ? (
            userToShow.recentPosts.map((post) => (
              <PostCard
                key={post.id || post._id || post.createdAt}
                post={{
                  ...post,
                  user: {
                    name: post.user?.name || userToShow?.name || "User",
                    avatarUrl: post.user?.avatarUrl || userToShow?.avatarUrl,
                    id: post.user?.id || post.user?._id || userToShow?._id || userToShow?.id,
                  },
                }}
                showDeleteButton={true}
              />
            ))
          ) : (
            <p className="text-gray-600">No posts yet</p>
          )}
        </section>
      </main>

      {/* Followers Modal */}
      {showFollowers && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFollowers(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Followers</h3>
              <button 
                onClick={() => setShowFollowers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {followersLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading followers...</p>
              </div>
            ) : followers.length > 0 ? (
              <div className="space-y-3">
                {followers.map((follower) => (
                  <div key={follower.id || follower._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <img
                      src={follower.avatarUrl || defaultpic}
                      alt={follower.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{follower.name}</p>
                      <p className="text-sm text-gray-500">@{follower.username || 'user'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No followers yet</p>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFollowing(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Following</h3>
              <button 
                onClick={() => setShowFollowing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {followingLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading following...</p>
              </div>
            ) : following.length > 0 ? (
              <div className="space-y-3">
                {following.map((followed) => (
                  <div key={followed.id || followed._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <img
                      src={followed.avatarUrl || defaultpic}
                      alt={followed.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{followed.name}</p>
                      <p className="text-sm text-gray-500">@{followed.username || 'user'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Not following anyone yet</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
