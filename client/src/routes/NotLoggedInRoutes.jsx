import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const NotLoggedInRoutes = () => {
  const { loggedUser } = useSelector((store) => store.currentUser);

  return loggedUser.email ? <Navigate to="/" /> : <Outlet />;
};

export default NotLoggedInRoutes;
