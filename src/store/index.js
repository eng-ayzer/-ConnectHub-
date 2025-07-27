import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./Slices/PostSlices";
import AuthReducer from "./Slices/AuthSlices";
import profileReducer from "./Slices/profileSlice";
import searchReducer from "./Slices/searchSlice";

const store = configureStore({
    reducer: {
        posts: postReducer,
        auth: AuthReducer,
        profile: profileReducer,
        search: searchReducer,
    }
});

export default store;
