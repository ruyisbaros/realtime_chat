from fastapi import WebSocket
from pydantic import BaseModel

"""socket.send(JSON.stringify({
    event: "send_message",
    recipient_id: 123,
    content: "Hello, how are you?"
}));"""


class WeBSocketList(BaseModel):
    ws: str
    client_id: int


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WeBSocketList] = []

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections.append(
            WeBSocketList(ws=websocket, client_id=client_id))

    def disconnect(self, websocket: WebSocket):
        self.active_connections = [
            item for item in self.active_connections if item.ws != websocket]

    async def send_personal_message(self, message: str, client_id: int):
        for conn in self.active_connections:
            if conn.client_id == client_id:
                await conn.ws.send_text(message)
                break
