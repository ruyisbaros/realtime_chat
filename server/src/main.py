from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
import json
import asyncio
from .utils.database import get_db, engine
from .utils import models
from .routes import auth_routes, user_routes, message_routes
from .socketServer import ConnectionManager
load_dotenv()


app = FastAPI()
get_db()  # run DB connection
models.Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Set to True if you're using cookies or authentication
    allow_headers=["Access-Control-Allow-Headers", 'Content-Type',
                   'Authorization', 'Access-Control-Allow-Origin', "Set-Cookie"],
    allow_methods=["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
)
manager = ConnectionManager()


# SET ROUTES
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(message_routes.router)
# app.include_router(album_routes.router)
# app.include_router(stats_routes.router)

# WebSocket Endpoint


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    await manager.connect(websocket, user_id)
    print(f"WebSocket connected for user {user_id}")

    try:
        while True:
            # Listen for incoming messages
            try:
                data = await websocket.receive_json()
                event_type = data.get("type")
                message_content = data.get("message")
                recipient_id = data.get("recipient_id", None)
                print(f"Received message from {user_id} to {
                      recipient_id}: {message_content}")

                if recipient_id:
                    await manager.send_to_user(
                        recipient_id=recipient_id,
                        message=message_content,
                        sender_id=user_id
                    )
                else:
                    print("Recipient ID not provided")
            except asyncio.TimeoutError:
                print(f"Timeout waiting for message from user {user_id}")
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user_id}")
        manager.disconnect(websocket, user_id)
