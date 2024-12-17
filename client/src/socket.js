// socket.js
const handleWebSocketOpen = (setIsConnected) => {
    console.log("ws opened");
    setIsConnected(true);
}

const handleWebSocketClose = (setIsConnected) => {
    console.log("ws closed");
    setIsConnected(false);
  
  // Add logic for reconnection attempts here, optionally:
  // setTimeout(establish_sockets, 3000); // Example: try reconnecting in 3 seconds
}
const handleWebSocketError = (error, setIsConnected) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
};
const sendSocketMessage = (ws, message) => {
  if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
  } else {
      console.error("WebSocket is not open.");
  }
};

export {handleWebSocketOpen, handleWebSocketClose, handleWebSocketError, sendSocketMessage}