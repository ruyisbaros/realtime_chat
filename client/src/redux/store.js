import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice"
import chatSlice from "./chatSlice"
import websocketSlice from "./websocket_slice"


export const store = configureStore({
    reducer: {
        currentUser: currentUserSlice,
        chat:chatSlice,
        websocket:websocketSlice,
    }
})