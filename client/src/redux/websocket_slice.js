/* eslint-disable no-unused-vars */
import { WS_CONNECTED, WS_DISCONNECTED, WS_MESSAGE_RECEIVED, WS_ERROR } from './actions';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isConnected: false,
    messages: [],
    error: null,
};

const websocketReducer1 = (state = initialState, action) => {
    switch (action.type) {
        case WS_CONNECTED:
            return { ...state, isConnected: true, error: null };
        case WS_DISCONNECTED:
            return { ...state, isConnected: false };
        case WS_MESSAGE_RECEIVED:
            return { ...state, messages: [...state.messages, action.payload] };
        case WS_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState: initialState,
    reducers: {
        // Add your websocket action reducers here
        ws_connected:(state, action) =>{
            state.isConnected = true;
            state.error = null;
            
        }
    }
})

export const { ws_connected } = websocketSlice.actions;
export default websocketSlice;
