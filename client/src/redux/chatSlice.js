import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatUsers: [],
  numberOfUsers: 0,
  between_chat: [],
  onlineUsers: [],
  selectedUser: null,
  usersLoading: false,
  chatLoading: false,
};

const chatSlice = createSlice({
    name: "chat",
  initialState,
  reducers: {
        get_chat_users:(state,action)=>{
            state.chatUsers = action.payload;
        }
  }
});

export const { get_chat_users } = chatSlice.actions;
export default chatSlice.reducer;