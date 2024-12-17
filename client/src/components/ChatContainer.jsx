/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./Chatheader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "../libs/utils";
import { Image, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { add_between_chats, addMessage_with_sockets } from "../redux/chatSlice";
import { useWebSocket } from "../socketIOClient";

const ChatContainer = ({ loadDialogues }) => {
  const dispatch = useDispatch();
  const socketRef = useWebSocket();
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  //console.log(text);
  // eslint-disable-next-line no-unused-vars
  const [imagePreview, setImagePreview] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { selectedUser, between_chat, chatUsers } = useSelector(
    (state) => state.chat
  );
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setMimeType(file.type);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      // eslint-disable-next-line no-unused-vars
      let image_file = imagePreview
        ? { image_mime_type: mimeType, image_data: imagePreview.split(",")[1] }
        : null;
      let messageInput = {
        body: text,
        recipient_id: selectedUser.id,
        image: image_file,
      };
      const { data } = await axios.post("messages", messageInput);
      console.log(data);
      setTimeout(() => {
        messageEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
      const content = {
        type: "chat_message",
        message: text,
        recipient_id: selectedUser.id,
      };
      socketRef.current.send(JSON.stringify(content));
      if (data) {
        dispatch(add_between_chats(data));
        // Clear form
        setText("");
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
        setTimeout(() => {
          messageEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 50);
        if (data.type === "message") {
          // Dispatch message to Redux store
          dispatch(
            addMessage_with_sockets({
              sender_id: data.sender_id,
              recipient_id: data.recipient_id,
              body: data.message,
              loggedUser: loggedUser,
            })
          );
        }
      };
    }
  }, [dispatch, socketRef]);

  useEffect(() => {
    setTimeout(() => {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
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
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {between_chat.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.sender.id === loggedUser.id ? "chat-end" : "chat-start"
            }`}
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
        <div ref={messageEndRef}></div>
      </div>
      {/* Scroll */}

      {/* Chat Input */}
      <div className="p-4 w-full">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"} `}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            onClick={handleSendMessage}
            className={`btn btn-sm btn-circle`}
            //disabled={!text.trim() || !imagePreview}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
