/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { get_chat_users } from "../redux/chatSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const fetch_chat_users = useCallback(async () => {
    try {
      const { data } = await axios.get("/users/get_all");
      console.log(data);
      dispatch(get_chat_users(data));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetch_chat_users();
  }, [fetch_chat_users]);
  return <div>HomePage</div>;
};

export default HomePage;
