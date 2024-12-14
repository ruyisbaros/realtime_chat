from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

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


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established")
    try:
        while True:
            # Wait for incoming data from the client
            data = await websocket.receive_json()

            # Handle the event type based on data
            event_type = data.get("event")
            content = data.get("content")
            recipient_id = data.get("recipient_id", None)

            if event_type == "send_message":
                await manager.send_personal_message(content, recipient_id)
            elif event_type == "create_comment":
                # Example for handling another event type
                await manager.broadcast(f"New comment: {content}")
            elif event_type == "update_profile":
                # Add logic for profile updates
                await manager.broadcast(f"Client #{client_id} updated profile")
            else:
                await websocket.send_text("Unknown event type")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Disconnect", websocket)


# SET ROUTES
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(message_routes.router)
# app.include_router(album_routes.router)
# app.include_router(stats_routes.router)
