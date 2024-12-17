/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isConnected: false,
    ws:{},
    error: null,
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        // Add your websocket action reducers here
        ws_connected:(state, action) =>{
            state.isConnected = true;
            state.error = null;
            state.ws = action.payload;
            
        }
    }
})

export const { ws_connected } = websocketSlice.actions;
export default websocketSlice.reducer;
