import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

const LoggedInRoutes = () => {
  const { loggedUser } = useSelector((store) => store.currentUser);

  return loggedUser.email ? <Outlet /> : <LoginPage />;
};

export default LoggedInRoutes;
