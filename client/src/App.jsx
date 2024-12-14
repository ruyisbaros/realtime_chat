import { useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import axios from "./axios";
import { setCurrentUser } from "./redux/currentUserSlice";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const get_current_user = useCallback(() => {
    try {
      const { data } = axios.get("/users/get_CU");
      console.log(data);
      //console.log(Cookies.get("user"));
      dispatch(setCurrentUser(data));
    } catch (error) {
      console.log(error);
      //toast.error(error.response.data.message);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedUser?.email) {
      dispatch(setCurrentUser(JSON.parse(Cookies.get("user"))));
    } else {
      get_current_user();
    }
  }, [get_current_user]);
  return (
    <>
      <div className="">
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
