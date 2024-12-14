import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Login from './../pages/login/Login';

const LoggedInRoutes = () => {
    const { loggedUser } = useSelector(store => store.currentUser)

    return loggedUser ? <Outlet /> : <Login />
}

export default LoggedInRoutes