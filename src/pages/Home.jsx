import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../components/posts/Postcard";

import { fetchPostsWithUsers,fetchComments } from "../store/Slices/PostSlices";
import { fetchConnections, checkAuthStatus } from "../store/Slices/AuthSlices";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer"

const HomePage = () => {
  const dispatch = useDispatch();

  const  {user} = useSelector((state) => state.auth);
  // console.log("USER", user)
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
  }, [status, dispatch]);

  const followingIds = user?.followingIds || [];
  const followerIds = user?.followerIds || [];

  const visibleUserIds = new Set([loggedInUserId, ...followingIds, ...followerIds]);

  const filteredPosts = posts
  .filter((post) => {
    const postUserId = post.user?.id || post.user?._id || post.userId;
    return visibleUserIds.has(postUserId);
  })
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
        <section className="bg-blue-600 text-white p-10 rounded-lg shadow-md mb-8 w-full px-6 py-12 lg:px-12">
          <h2 className="text-xl font-semibold">
            Welcome back, {user?.name || "Guest"}
          </h2>
          <p className="text-sm">Discover what's happening in your network.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-2xl font-bold"> {userPostCount}</p>
            <p>Your Posts</p>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-2xl font-bold">{user.followingCount}</p>  
            <p>Following</p>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-2xl font-bold">{feedPostCount}</p>
            <p>Feed Posts</p>
          </div>
        </section>

        {/* Posts Feed */}
        {status === "loading" && <p>Loading posts...</p>}
        {status === "failed" && <p className="text-red-600">Error loading posts: {error}</p>}
        {status === "succeeded" && posts.length === 0 && <p>No posts to show.</p>}

        {status === "succeeded" && filteredPosts.length > 0 &&(
          <div className=" space-y-2 w-full max-w-6xl mx-auto  ">
         {filteredPosts.map((post, index) => (
          <PostCard key={post._id || post.id || post.createdAt || index} post={post} />
          ))}
          </div>
        )}

         

      </main>
      {/* Footer is only visible on mobile devices */}
      <Footer />
    </div>
  );
};

export default HomePage;

