//import { useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
//import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

//import axios from "./axios";
//import { setCurrentUser } from "./redux/currentUserSlice";
import SignUpPage from "./pages/SignUpPage";
import { useCallback, useEffect } from "react";
import { WebSocketProvider } from "./socketIOClient";

function App() {
  const navigate = useNavigate();

  const navigate_to_login = useCallback(async () => {
    if (!Cookies.get("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    navigate_to_login();
  }, [navigate_to_login]);

  return (
    <>
      <div className="">
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar />
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
          </Routes>
        </WebSocketProvider>
      </div>
    </>
  );
}

export default App;
