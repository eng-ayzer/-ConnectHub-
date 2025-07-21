import React from 'react';
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost, fetchComments, createComment, deletePost, deleteComment } from '../../store/Slices/PostSlices';
import { formatName } from "../utils/formatName";

function PostCard({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const likesCount = post.likesCount ?? 0;
  const liked = post.likedByUser ?? false;
  const [commentText, setCommentText] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);

  const postId = post._id || post.id;

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

const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId));
    }
};


  const postUser = post.user || {};
  const avatar = postUser.avatarUrl || "/default-avatar.png";

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
    <div className="bg-white rounded-md shadow-md p-6 w-full ">
     <div className="flex items-center justify-between w-full ">
      <div className="flex items-center space-x-3">
        <img
          src={avatar}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{formatName(postUser.name || "User")}</p>
          <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
       {currentUser?.id === post.userId && (
          <button
            onClick={handleDeletePost}
            className="text-red-600 hover:text-red-800"
            title="Delete Post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      {/* Post Text and Image */}
      <p className="mb-3 break-words whitespace-pre-wrap text-gray-800">{post.text || "No content"}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post image"
          className="sm:rounded-md max-h-[500px] block object-contain mb-3 mx-w-md"
        />
      )}
       
      {/* like and Comment Buttons */}
      <div className="flex space-x-10 mt-2">
        <button
      onClick={handleLikeToggle}
      className={`flex items-center space-x-1 transition duration-200 ${
        liked ? "text-red-600 scale-105" : "text-gray-600 hover:text-red-500"
      }`}
    >
      <Heart
        size={20}
        className={liked ? "fill-current text-red-600" : "stroke-current"}
      />
      <span>{likesCount}{liked ? "" : ""}</span>
    </button>

        <button
          onClick={() => setCommentsVisible((prev) => !prev)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition"
        >
          <MessageCircle size={20} />
          <span>{comments.length}{commentsVisible ? "" : ""}</span>
        </button>
      </div>
      {/* Comments */}
      {commentsVisible && (
        <>
          <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
            >
              Post
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {commentsStatus === "loading" && <p>Loading comments...</p>}
            {commentsStatus === "failed" && (
              <p className="text-red-600">Error loading comments.</p>
            )}
            {comments.map((comment) => (
              <div key={ comment.id} className="bg-gray-100 p-2 rounded"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatName(comment.user?.name || "Anonymous")}
                  </p>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
                {/* Optional delete button */}
                {(comment.userId === currentUser?.id || post.userId === currentUser?.id) && (
                  <button
                    onClick={() =>
                      dispatch(
                        deleteComment({
                          postId: post._id || post.id,
                          commentId: comment._id || comment.id,
                        })
                      )
                    }
                    
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
        </div>
        </>
      )}
      </div>
      );
}

export default PostCard;
