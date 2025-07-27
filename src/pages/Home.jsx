import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PostCard from "../Components/posts/Postcard";
import defaultAvatar from "../assets/defaultimage.png";

import { fetchPostsWithUsers,fetchComments } from "../store/Slices/PostSlices";
import { fetchConnections, checkAuthStatus } from "../store/Slices/AuthSlices";
import Sidebar from "../Components/layout/Sidebar";
import Footer from "../components/layout/Footer"

const HomePage = () => {
  const dispatch = useDispatch();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const  {user} = useSelector((state) => state.auth);
  console.log("USER in Home:", user);
  console.log("User avatar URL:", user?.avatarUrl);
  const { posts, status, error } = useSelector((state) => state.posts);

  const loggedInUserId = user?._id || user?.id;

  const fetchedCommentsRef = useRef(new Set());

  useEffect(() => {
    posts.forEach((post) => {
      const postId = post._id || post.id;
      if (!fetchedCommentsRef.current.has(postId)) {
        fetchedCommentsRef.current.add(postId);
        dispatch(fetchComments(postId));
      }
    });
  }, [posts, dispatch]);

  useEffect(() => {
    if (user?.id && (!user.followingIds || !user.followerIds)) {
      dispatch(fetchConnections(user.id));
    }
    if (status === "idle") {
      dispatch(fetchPostsWithUsers());
      dispatch(checkAuthStatus());
    }
  }, [status, dispatch, user?.id]);

  // Refresh user data when component mounts to ensure latest profile picture
  useEffect(() => {
    if (user?.id) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, user?.id]);

  // Force refresh user data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        dispatch(checkAuthStatus());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, user?.id]);

  const followingIds = user?.followingIds || [];

  // Show all posts from everyone (like in the image)
  const filteredPosts = [...posts]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  

  // Counts how many posts belong to the logged-in user

const userPostCount = posts.filter((p) => p.user?.id === loggedInUserId).length;
  // Total posts in the feed

  const feedPostCount = filteredPosts.length;
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex flex-col w-full md:ml-48 px-4 py-8 max-w-7xl mx-auto mb-8">
        {/* Welcome */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {imageLoading && (
                  <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={user?.avatarUrl || defaultAvatar}
                  alt="Profile"
                  className={`w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
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
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.name || "Guest"}! 👋
                </h2>
                <p className="text-blue-100 text-lg">Discover what's happening in the entire community.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">{userPostCount}</div>
            <p className="text-gray-600 font-medium">Your Posts</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">{followingIds.length}</div>
            <p className="text-gray-600 font-medium">Following</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">{posts.length}</div>
            <p className="text-gray-600 font-medium">All Posts</p>
          </div>
        </section>

        {/* Posts Feed */}
        {status === "loading" && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading your feed...</p>
          </div>
        )}
        
        {status === "failed" && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">Error loading posts: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {status === "succeeded" && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome to ConnectHub!
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Be the first to create a post and start sharing with the community!
              </p>
              <Link 
                to="/create-post" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Create Your First Post
              </Link>
            </div>
          </div>
        )}

        {status === "succeeded" && filteredPosts.length > 0 && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                🌍 All Posts
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredPosts.length} posts
              </span>
            </div>
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <PostCard key={post._id || post.id || post.createdAt || index} post={post} />
              ))}
            </div>
          </div>
        )}

         

      </main>
      {/* Footer is only visible on mobile devices */}
      <Footer />
    </div>
  );
};

export default HomePage;

