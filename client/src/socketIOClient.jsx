import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const WebSocketContext = createContext(null);
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const reconnectInterval = useRef(null);
  const { loggedUser } = useSelector((store) => store.currentUser);

  /*   if (!loggedUser) {
    return;
  } */
  const connectWebSocket = () => {
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/${loggedUser.id}`
    ); // Add your user_id

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current); // Clear reconnect attempts
        reconnectInterval.current = null;
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          connectWebSocket();
        }, 3000); // Try to reconnect every 3 seconds
      }
    };

    socketRef.current.onmessage = (event) => {
      console.log("Message received:", event.data);
    };
  };

  useEffect(() => {
    if (loggedUser?.id) {
      connectWebSocket();
    }
    return () => {
      socketRef.current.close();
      clearInterval(reconnectInterval.current);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socketRef}>
      {children}
    </WebSocketContext.Provider>
  );
};
