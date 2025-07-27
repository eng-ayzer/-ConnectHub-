import React from 'react';
import { Heart, MessageCircle, Trash2, UserPlus } from "lucide-react";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost, fetchComments, createComment, deletePost, deleteComment } from '../../store/Slices/PostSlices';
import { followUser, unfollowUser } from '../../store/Slices/profileSlice';
import { formatName } from "../utils/formatName";
import defaultAvatar from "../../assets/defaultimage.png";

function PostCard({ post, showDeleteButton = false }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const likesCount = post.likesCount ?? 0;
  const liked = post.likedByUser ?? false;
  const [commentText, setCommentText] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);

  const rawPostId = post._id || post.id;
  const postId = rawPostId ? String(rawPostId) : null;
  
  // Debug post ID
  console.log("Raw Post ID:", rawPostId);
  console.log("Processed Post ID:", postId);
  console.log("Post object keys:", Object.keys(post));
  console.log("Post ID type:", typeof postId);
  console.log("Post ID length:", postId ? postId.length : 0);
  console.log("Full post object:", JSON.stringify(post, null, 2));

  const comments = useSelector((state) => state.posts.commentsByPost[postId] || []);
  const commentsStatus = useSelector((state) => state.posts.commentsStatus[postId] || "idle");
  

  useEffect(() => {
    if (post._id && commentsVisible && commentsStatus === "idle") {
      dispatch(fetchComments(postId));
    }
  }, [commentsVisible, commentsStatus, dispatch, postId]);

const handleLikeToggle = () => {
  if (liked) {
    dispatch(unlikePost(postId));
    
  } else {
    dispatch(likePost(postId));
  }
  
};

const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(createComment({ postId, text: commentText })).then(() =>{
      dispatch(fetchComments(postId));
    });
    setCommentText("");
};

const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        console.log("=== DELETE POST DEBUG ===");
        console.log("Attempting to delete post with ID:", postId);
        console.log("Full post object:", post);
        console.log("Current user:", currentUser);
        console.log("Is own post:", isOwnPost);
        
        const result = await dispatch(deletePost(postId)).unwrap();
        console.log("Post deleted successfully, result:", result);
      } catch (error) {
        console.error("=== DELETE POST ERROR ===");
        console.error("Failed to delete post:", error);
        console.error("Error message:", error.message);
        console.error("Error payload:", error.payload);
        console.error("Error stack:", error.stack);
        
        // Show more specific error message
        const errorMessage = error.payload || error.message || "Unknown error occurred";
        alert(`Failed to delete post: ${errorMessage}`);
      }
    }
};

const handleFollowToggle = async () => {
  if (isOwnPost) return;
  try {
    if (isFollowing) {
      await dispatch(unfollowUser(postUserId)).unwrap();
    } else {
      await dispatch(followUser(postUserId)).unwrap();
    }
  } catch (error) {
    console.error("Follow/Unfollow failed:", error);
  }
};


  const postUser = post.user || {};
  const avatar = postUser.avatarUrl || defaultAvatar;
  const postUserId = post.user?.id || post.user?._id || post.userId;
  
  // Get current user ID in multiple formats
  const currentUserId = currentUser?.id || currentUser?._id;
  
  // Debug logging for user ID comparison
  console.log("PostCard Debug:", {
    currentUser: currentUser,
    currentUserId: currentUserId,
    postUserId: postUserId,
    postUser: postUser,
    postUserIdType: typeof postUserId,
    currentUserIdType: typeof currentUserId,
    isOwnPost: currentUserId === postUserId
  });
  
  const isOwnPost = currentUserId === postUserId;
  const isFollowing = post.isFollowing || false;

  const timeAgo = (timestamp) => {
    const now = Date.now();
    const postTime = typeof timestamp === 'number' 
      ? timestamp 
      : new Date(timestamp).getTime();
    const diff = now -  postTime;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' minutes ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    return new Date(postTime).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full border border-gray-100 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {imageLoading && (
              <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={avatar}
              alt="User avatar"
              className={`w-14 h-14 rounded-full object-cover border-3 border-blue-200 shadow-md hover:shadow-lg transition-all duration-200 ${
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
            <p className="font-bold text-gray-900">{formatName(postUser.name || "User")}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isOwnPost && (
            <button
              onClick={handleFollowToggle}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                isFollowing
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <UserPlus size={14} />
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </button>
          )}
          {isOwnPost && showDeleteButton && (
            <button
              onClick={handleDeletePost}
              className="text-red-600 hover:text-red-800 p-3 rounded-full hover:bg-red-50 transition-colors border-2 border-red-300 hover:border-red-400 z-10 relative shadow-md"
              title="Delete Post"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              <Trash2 size={20} />
            </button>
          )}

        </div>
      </div>
      
      {/* Post Text and Image */}
      <div className="mb-4">
        <p className="text-gray-800 text-lg leading-relaxed break-words whitespace-pre-wrap">
          {post.text || "No content"}
        </p>
      </div>
      
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full rounded-lg max-h-[500px] object-cover shadow-sm"
          />
        </div>
      )}
       
      {/* like and Comment Buttons */}
      <div className="flex items-center space-x-8 pt-4 border-t border-gray-100">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            liked 
              ? "text-red-600 bg-red-50 hover:bg-red-100" 
              : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
          }`}
        >
          <Heart
            size={20}
            className={liked ? "fill-current text-red-600" : "stroke-current"}
          />
          <span className="font-medium">{likesCount}</span>
        </button>

        <button
          onClick={() => setCommentsVisible((prev) => !prev)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
        >
          <MessageCircle size={20} />
          <span className="font-medium">{comments.length}</span>
        </button>
      </div>
      {/* Comments */}
      {commentsVisible && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <form onSubmit={handleCommentSubmit} className="mb-4 flex space-x-3">
            <input
              type="text"
              className="flex-grow border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {commentsStatus === "loading" && (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading comments...</p>
              </div>
            )}
            {commentsStatus === "failed" && (
              <p className="text-red-600 text-center py-4">Error loading comments.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {formatName(comment.user?.name || "A").charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        {formatName(comment.user?.name || "Anonymous")}
                      </p>
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                  </div>
                  {/* Delete button for comment owner or post owner */}
                  {(comment.userId === currentUser?.id || post.userId === currentUser?.id) && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this comment?")) {
                          dispatch(
                            deleteComment({
                              postId: post._id || post.id,
                              commentId: comment._id || comment.id,
                            })
                          );
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                      title="Delete Comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
