import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import RegistrationPage from "./pages/registrationPage.jsx";
import Signin from "./pages/SignForm.jsx";
import ProtectedRoutes from "./components/auth/ProtectRoutes.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import NotificationPage from "./pages/NotificationsPage.jsx";
import SearchPage from "./pages/SearchsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Header from "./components/layout/Header.jsx";
import AboutPage from "./pages/AboutPage.jsx";

import { checkAuthStatus } from "./store/Slices/AuthSlices";

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

          <Route
            path="/"
            element={
              <ProtectedRoutes requireAuth={true}>
                <Home />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoutes requireAuth={true}>
                <CreatePostPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoutes requireAuth={true}>
                <NotificationPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoutes requireAuth={true}>
                <SearchPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes requireAuth={true}>
                <ProfilePage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoutes requireAuth={false}>
                <RegistrationPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/signin"
            element={
              <ProtectedRoutes requireAuth={false}>
                <Signin />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoutes requireAuth={true}>
                <AboutPage />
              </ProtectedRoutes>
            }
          />

        </Routes>
      </main>
    </div>
  );
}

export default App;
