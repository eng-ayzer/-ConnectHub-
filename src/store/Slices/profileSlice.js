import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// Get Auth Header
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
};

// Fetch logged-in user's profile
export const fetchMyProfile = createAsyncThunk(
    "profile/fetchMyProfile",
    async (_, thunkAPI) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/auth/profile`,
          getAuthHeader()
        );
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.error || "Failed to fetch my profile"
        );
      }
    }
  );
// Fetch public profile by ID
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
  );



//  Update own profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (updateData, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/auth/profile`,
        updateData,
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update profile"
      );
    }
  }
);
// follow user
export const followUser = createAsyncThunk(
    "profile/followUser",
    async (targetUserId, thunkAPI) => {
        try {
            const res = await axios.post(
              `${BASE_URL}/users/${targetUserId}/follow`,
              {},
              getAuthHeader()
            );
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to follow user");
        }
    }
  );
  
  // unfollow user
  export const unfollowUser = createAsyncThunk(
    "profile/unfollowUser",
      async (targetUserId, thunkAPI) => {
          try {
              const res = await axios.post(
                `${BASE_URL}/users/${targetUserId}/unfollow`,
                {},
                getAuthHeader()
              );
              return res.data;
          }
          catch (err) {
              return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to follow user");
          }
      }
  );

const initialState = {
  myProfile: null,
  profileUser: null,
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
      builder
        // Fetch logged-in user's profile
        .addCase(fetchMyProfile.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchMyProfile.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.myProfile = action.payload;
          state.error = null;
        })
        .addCase(fetchMyProfile.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        //fetch public profile
        .addCase(fetchUserProfile.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.profileUser = action.payload;
          state.error = null;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        //update profile
        .addCase(updateUserProfile.pending, (state) => {
          state.status = "loading";
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.myProfile = action.payload;
          state.error = null;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        // Follow
        .addCase(followUser.fulfilled, (state) => {
          if (state.profileUser) {
            state.profileUser.followersCount =
              (state.profileUser.followersCount || 0) + 1;
            state.profileUser.isFollowing = true;
          }
        })
        .addCase(followUser.rejected, (state, action) => {
          state.error = action.payload || action.error.message;
        })

        // Unfollow
        .addCase(unfollowUser.fulfilled, (state) => {
          if (state.profileUser) {
            state.profileUser.followersCount = Math.max(
              0,
              (state.profileUser.followersCount || 1) - 1
            );
            state.profileUser.isFollowing = false;
          }
        })
        .addCase(unfollowUser.rejected, (state, action) => {
          state.error = action.payload || action.error.message;
        });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
