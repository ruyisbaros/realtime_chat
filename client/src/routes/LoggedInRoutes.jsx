import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

const LoggedInRoutes = () => {
  const { loggedUser } = useSelector((store) => store.currentUser);

  return loggedUser?.email ? <Outlet /> : <SignUpPage />;
};

export default LoggedInRoutes;
