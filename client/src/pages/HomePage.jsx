/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { get_between_chats, get_chat_users } from "../redux/chatSlice";
import Sidebar from "../components/Sidebar";
import NoChatSelect from "../components/NoChatSelect";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [loadDialogues, setLoadDialogues] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const fetch_chat_users = useCallback(async () => {
    try {
      setIsUsersLoading(true);
      const { data } = await axios.get("/users/get_all");
      //console.log(data);
      dispatch(get_chat_users(data));
      setIsUsersLoading(false);
    } catch (error) {
      console.log(error);
      setIsUsersLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetch_chat_users();
  }, [fetch_chat_users]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar
              isUsersLoading={isUsersLoading}
              setLoadDialogues={setLoadDialogues}
            />
            {!selectedUser ? (
              <NoChatSelect />
            ) : (
              <ChatContainer loadDialogues={loadDialogues} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
