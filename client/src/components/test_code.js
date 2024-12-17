import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        chatBetween: [], // Array of chat objects, each containing message details
    },
    reducers: {
        setChats: (state, action) => {
            // Fetch initial chats from backend
            state.chatBetween = action.payload;
        },
        addNewMessage: (state, action) => {
            const { recipient_id, sender_id, body, image_url, created_at } = action.payload;

            // 1. Find the correct chat object (check sender or receiver id match)
            const chat = state.chatBetween.find(
                (chat) =>
                    (chat.sender.id === sender_id && chat.receiver.id === recipient_id) ||
                    (chat.sender.id === recipient_id && chat.receiver.id === sender_id)
            );

            if (chat) {
                // 2. Push the new message to the chat array
                state.chatBetween.push({
                    id: Date.now(), // Temporary unique ID for the message
                    sender: chat.sender.id === sender_id ? chat.sender : chat.receiver, // Ensure correct sender
                    receiver: chat.sender.id === recipient_id ? chat.sender : chat.receiver, // Ensure correct receiver
                    body,
                    image_url,
                    created_at: created_at || new Date().toISOString(), // Use provided timestamp or current time
                });
            } else {
                // If chat doesn't exist, optionally create a new one
                console.warn("Chat not found for recipient and sender IDs:", recipient_id, sender_id);
            }
        },
    },
});

export const { setChats, addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
