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
        },
        get_between_chats:(state,action)=>{
          state.between_chat = [...action.payload];
        },
        setSelectedUser:(state,action)=>{
          state.selectedUser = action.payload;
        }

  }
});

export const { get_chat_users,get_between_chats,setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;