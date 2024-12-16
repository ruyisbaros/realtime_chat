//import { useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
//import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

//import axios from "./axios";
//import { setCurrentUser } from "./redux/currentUserSlice";
import SignUpPage from "./pages/SignUpPage";
import { useCallback, useEffect, useRef } from "react";

function App() {
  const ws = useRef(null); // useRef for WebSocket instance
  const { loggedUser } = useSelector((store) => store.currentUser);

  const establish_sockets = useCallback(async () => {
    console.log("Socket triggered");
    ws.current = new WebSocket(`ws://localhost:8000/ws/${loggedUser.id}`);

    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    /*  ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }; */
  }, []);
  useEffect(() => {
    establish_sockets();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [establish_sockets]);

  return (
    <>
      <div className="">
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
