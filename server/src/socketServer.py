from fastapi import WebSocket
from typing import List, Dict
import json

"""socket.send(JSON.stringify({
    event: "send_message",
    recipient_id: 123,
    content: "Hello, how are you?"
}));"""


# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        # Store user_id: websocket
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        self.active_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections and self.active_connections[user_id] == websocket:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, recipient_id: int):
        if recipient_id in self.active_connections:
            websocket = self.active_connections[recipient_id]
            await websocket.send_text(message)
        else:
            print(f"Recipient {recipient_id} not found")

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)
