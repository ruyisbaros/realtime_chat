import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice"


export const store = configureStore({
    reducer: {
        currentUser: currentUserSlice
    }
})