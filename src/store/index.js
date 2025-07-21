import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./Slices/PostSlices";
import AuthReducer from "./Slices/AuthSlices";
import profileReducer from "./Slices/profileSlice";

const store = configureStore({
    reducer:{
     posts: postReducer,
    auth: AuthReducer,
    profile: profileReducer,
    }
})

export default store;