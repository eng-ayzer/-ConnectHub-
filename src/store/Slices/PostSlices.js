import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";
import { Users } from "lucide-react";


//axios.defaults.withCredentials = true;
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false,
  };
};
// fetch posts + fetch user info for each post
export const fetchPostsWithUsers = createAsyncThunk(
  "posts/fetchPostsWithUsers",
  async (_, thunkAPI) => {
    try {
// <<<<<<< shamsudin-dahir
//       const token = localStorage.getItem("authToken");

//       // Fetch posts feed
//       const postsResponse = await axios.get(`${BASE_URL}/posts/feed`, getAuthHeader());
//       //console.log("postsResponse.data", postsResponse.data);

//       const posts = postsResponse.data;
// console.log("postslice",posts)
//       // Extract unique userIds from posts
//       const userIds = [...new Set(posts.map((post) => post.userId))];

//       // Fetch each user's info concurrently
//       const userRequests = userIds.map((id) =>
//         axios
//           .get(`${BASE_URL}/users/${id}`, getAuthHeader())
//           .then((res) => res.data)
//       );

//       const users = await Promise.all(userRequests);
// console.log("userslice",users)
//       // Create a map userId => user
//       const userMap = {};
//       users.forEach((user) => {
//         userMap[user.id] = user;
//       });
// console.log("usermappp",userMap.undefined)
//       // Attach user info to each post
//       const postsWithUsers = posts.map((post) => ({
//         ...post,
//         user: userMap.undefined || { name: "User Not Found" }
//       }));
      
//       return postsWithUsers;
//     } catch (error) {
// =======
      const res = await axios.get(`${BASE_URL}/posts`);
      
      return res.data;
    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch posts"
      );
    }
  }
    
);

// Create a new post 
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const requestData = {
        text: postData.text,
        ...(postData.imageUrl && { image_url: postData.imageUrl }),
      };
      const response = await axios.post(
        `${BASE_URL}/posts`,
        requestData,
        getAuthHeader()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);
// Delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/posts/${postId}`, getAuthHeader());
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);
// Like a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/like`,
        {},
        getAuthHeader()
      );
      console.log("likePost response.data:", response.data);
      return { postId };
    } catch (error) {
      console.error("Error liking post:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);
// Unlike a post

export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/unlike`,
        {},
        getAuthHeader()
      );
      console.log("unlikePost response.data:", response.data);
      return { postId };
    } catch (error) {
      console.error("Error unliking post:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);
// Fetch comments for a post
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/posts/${postId}/comments`,
        getAuthHeader()
      );
      
      return { postId, comments: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

// Create a new comment on a post
export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/comments`,
        { text },
        getAuthHeader()
      );
      return { postId, comment: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);
//delete Comment on a post
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/posts/${postId}/comments/${commentId}`,
        getAuthHeader()
      );
      return { postId, commentId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);




// Initial state for the post slice
const initialState = {
  posts: [],
  status: "idle",
  error: null,

  createPostForm: {
    text: "",
    image: null,
    preview: null,
  },
  commentsByPost: {}, 
  commentsStatus: {}, 
  commentsError: {},
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePostText: (state, action) => {
      state.createPostForm.text = action.payload;
    },
    updatePostImage: (state, action) => {
      state.createPostForm.image = action.payload.image || null;
      state.createPostForm.preview = action.payload.preview;
    },
    resetCreatePostForm: (state) => {
      state.createPostForm = { text: "", image: null, preview: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts with user info
      .addCase(fetchPostsWithUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsWithUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPostsWithUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload && post.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find(
          (p) => p._id === postId || p.id === postId
        );
        if (post) {
          post.likesCount = (post.likesCount ?? 0) + 1;
          post.likedByUser = true;
        }
      })
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find(
          (p) => p._id === postId || p.id === postId
        );
        if (post && post.likesCount > 0) {
          post.likesCount -= 1;
          post.likedByUser = false;
        }
      })
      // Fetch Comments for a post
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg;
        state.commentsStatus[postId] = "loading";
      })
      // Fulfilled for fetching comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsByPost[postId] = comments;
        state.commentsStatus[postId] = "succeeded";
      })
      // Rejected for fetching comments
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentsStatus[action.meta.arg] = "failed";
        state.commentsError[action.meta.arg] =
          action.payload || action.error.message;
      })
      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }
        state.commentsByPost[postId].push(comment);
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId] = state.commentsByPost[postId].filter(
            (comment) => comment.id !== commentId && comment._id !== commentId
          );
        }
      });
      

  },
});

export const { updatePostText, updatePostImage, resetCreatePostForm } =
  postSlice.actions;

export default postSlice.reducer;
