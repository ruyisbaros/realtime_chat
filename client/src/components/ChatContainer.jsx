/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import ChatHeader from "./Chatheader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useSelector } from "react-redux";
import { formatMessageTime } from "../libs/utils";

const ChatContainer = ({ loadDialogues }) => {
  const messageEndRef = useRef(null);
  const { selectedUser, between_chat, chatUsers } = useSelector(
    (state) => state.chat
  );
  const { loggedUser } = useSelector((store) => store.currentUser);

  useEffect(() => {
    if (messageEndRef.current && between_chat) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [between_chat]);

  if (loadDialogues) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {between_chat.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.sender.id === loggedUser.id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender.id === loggedUser.id
                      ? loggedUser.prof_img_url || "/avatar.png"
                      : selectedUser.prof_img_url || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.created_at)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message?.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.body && <p>{message.body}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
