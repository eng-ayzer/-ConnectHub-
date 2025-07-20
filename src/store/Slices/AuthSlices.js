import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// Helper function to get the authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
};


// Helper function to get the authorization header
// const getAuthHeader = () => {
//   const token = localStorage.getItem("authToken");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

//Check authentication status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/me`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Unauthorized");
    }
  }
);

//Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    try {
      console.log("USERDATA", userData);
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          
        }
      );
      console.log("response", response);
      const { token, user} = response.data;
      localStorage.setItem("authToken", token);
      return user

     
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  }
);


// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);

      return user
     
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }
);

// Logout user
const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("authToken");
});

export const fetchConnections = createAsyncThunk(
  "auth/fetchConnections",
  async (userId, thunkAPI) => {
    try {
      const [followingRes, followersRes] = await Promise.all([
        axios.get(`${BASE_URL}/users/me/following`, getAuthHeader()),
        axios.get(`${BASE_URL}/users/me/followers`, getAuthHeader()), 
      ]);
      console.log("Raw following:", followingRes.data);
      return {
        following: followingRes.data.map((u) => u.id),
        followers: followersRes.data.map((u) => u.id),
      };
      

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch connections"
      );
    }
  }
);


const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  user: null,
  status: "idle",
  error: null,
  //profileUser: null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
        console.log("action.payload",action.payload)
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
        // state.profileUser = null;
        state.error = null;
      }) 
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.followingIds = action.payload.following;
        state.followerIds = action.payload.followers;
      });
    

      
      
  },
});

export const { clearError } = authSlice.actions;
export { logoutUser }; 
export default authSlice.reducer;
