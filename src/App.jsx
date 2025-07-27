import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./store/Slices/AuthSlices";
import ProtectedRoutes from "./components/auth/ProtectRoutes";
import Header from "./components/layout/Header";

import Home from "./pages/Home";
import CreatePostPage from "./pages/CreatePostPage";
import NotificationPage from "./pages/NotificationsPage";
import SearchPage from "./pages/SearchsPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage";
import Signin from "./pages/SignForm";
import AboutPage from "./pages/About";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<ProtectedRoutes requireAuth={true}><Home /></ProtectedRoutes>} />
          <Route path="/create-post" element={<ProtectedRoutes requireAuth={true}><CreatePostPage /></ProtectedRoutes>} />
          <Route path="/notifications" element={<ProtectedRoutes requireAuth={true}><NotificationPage /></ProtectedRoutes>} />
          <Route path="/search" element={<ProtectedRoutes requireAuth={true}><SearchPage /></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes requireAuth={true}><ProfilePage /></ProtectedRoutes>} />
          <Route path="/register" element={<ProtectedRoutes requireAuth={false}><RegistrationPage /></ProtectedRoutes>} />
          <Route path="/signin" element={<ProtectedRoutes requireAuth={false}><Signin /></ProtectedRoutes>} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
