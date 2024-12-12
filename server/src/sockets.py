# Socket_io.py file
import uvicorn
import socketio
from fastapi import FastAPI
# Fast API application
app = FastAPI()
# Socket io (sio) create a Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
# wrap with ASGI application
socket_app = socketio.ASGIApp(sio)
app.mount("/", socket_app)
# Print {"Hello":"World"} on localhost:7777


@app.get("/")
def read_root():
    return {"Hello": "World"}


@sio.on("connect")
async def connect(sid, env):
    print("New Client Connected to This id :"+" "+str(sid))


@sio.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: "+" "+str(sid))
if __name__ == "__main__":
    uvicorn.run("Soket_io:app", host="0.0.0.0",
                port=7777, lifespan="on", reload=True)
