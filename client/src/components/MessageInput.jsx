/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { add_between_chats } from "../redux/chatSlice";

const MessageInput = () => {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  console.log(text);
  // eslint-disable-next-line no-unused-vars
  const [imagePreview, setImagePreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);
  const [mimeType, setMimeType] = useState(null);

  const { selectedUser, between_chat } = useSelector((state) => state.chat);
  const { loggedUser } = useSelector((store) => store.currentUser);
  // eslint-disable-next-line no-unused-vars
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
      if (data) {
        dispatch(add_between_chats(data));
        // Clear form
        setText("");
        setImagePreview(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendMessageSocket = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          event: "send_message",
          content: message,
          recipient_id: selectedUser.id,
        })
      );
    }
  };
  return (
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
  );
};

export default MessageInput;
