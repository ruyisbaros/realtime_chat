
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    await manager.connect(websocket, user_id)
    print(f"WebSocket connected for user {user_id}")

    try:
        while True:
            websocket.r
            # Send ping periodically to keep the connection alive
            await websocket.send_json({"type": "ping", "message": "heartbeat"})
            await asyncio.sleep(3)  # Send a heartbeat every 30 seconds

            # Listen for incoming messages
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=3)
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
