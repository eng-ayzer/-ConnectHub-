import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

export const fetchProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/api/search/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// export const flowUser = createAsyncThunk(
//   "follow/fo"
// )

export const getProfile = createAsyncThunk(
  'search/getProfile',
  async (token, thunkAPI) => {
    try {
      return await fetchProfile(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
  user: null,
  status: 'idle',
  error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;

