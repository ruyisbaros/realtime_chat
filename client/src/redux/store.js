import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice"
import chatSlice from "./chatSlice"


export const store = configureStore({
    reducer: {
        currentUser: currentUserSlice,
        chat:chatSlice
    }
})