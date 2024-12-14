import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import axios from "./axios";

function App() {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  if (loggedUser.email) {
    console.log(loggedUser);
  } else {
    console.log("no user logged in");
  }
  return (
    <>
      <div className="">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<LoggedInRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route element={<NotLoggedInRoutes />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
