from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
import json
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
    print("WebSocket connection established")
    print(manager.active_connections)
    try:
        async for data in websocket.iter_json():  # Use async for loop
            try:
                event_type = data.get("event")
                content = data.get("content")
                recipient_id = data.get("recipient_id", None)

                if event_type == "send_message":
                    if not recipient_id:
                        await websocket.send_text(json.dumps({"error": "Recipient ID is required"}))
                        continue

                    # Simply forward the message to the recipient
                    await manager.send_personal_message(json.dumps({
                        "event": "receive_message",
                        "content": content,
                        "sender_id": user_id
                    }), recipient_id)
                elif event_type == "create_comment":
                    # Example for handling another event type
                    await manager.broadcast(f"New comment: {content}")
                elif event_type == "update_profile":
                    # Add logic for profile updates
                    await manager.broadcast(f"Client #{user_id} updated profile")
                else:
                    await websocket.send_text(json.dumps({"error": "Unknown event type"}))
            except Exception as e:
                print(f"Error processing message: {e}")
                await websocket.send_text(json.dumps({"error": "Internal server error"}))
    except WebSocketDisconnect:
        print(f"WebSocket connection closed for user {user_id}")
        manager.disconnect(websocket, user_id)
