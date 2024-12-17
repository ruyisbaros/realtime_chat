import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatUsers: [],
  numberOfUsers: 0,
  between_chat: [],
  onlineUsers: [],
  selectedUser: null,
  usersLoading: false,
  chatLoading: false,
  chat_with:null
};

const chatSlice = createSlice({
    name: "chat",
  initialState,
  reducers: {
        get_chat_users:(state,action)=>{
            state.chatUsers = action.payload;
        },
        get_between_chats:(state,action)=>{
          state.between_chat = [...action.payload.messages];
          state.chat_with=action.payload.user
        },
        setSelectedUser:(state,action)=>{
          state.selectedUser = action.payload;
        }, 
        add_between_chats:(state,action)=>{
          state.between_chat.push(action.payload);
        },
        addMessage_with_sockets:(state,action)=>{
          const temp = {receiver:action.payload.recipient_id===state.chat_with.id?state.chat_with:action.payload.loggedUser, 
            sender:action.payload.sender_id===action.payload.loggedUser.id?action.payload.loggedUser:state.chat_with,body:action.payload.body, id:Date.now(), image_url:null,created_at:Date.now()};
          state.between_chat.push(temp);
        }

  }
});

export const { get_chat_users,get_between_chats,setSelectedUser,add_between_chats,addMessage_with_sockets } = chatSlice.actions;
export default chatSlice.reducer;