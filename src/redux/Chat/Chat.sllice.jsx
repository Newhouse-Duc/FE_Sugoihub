import { createSlice } from "@reduxjs/toolkit";
import { getConservationId, getMessageChat, createConservation, voice, deleteConversation } from "./Chat.thunk";

const initialState = {

    chats: [],
    conversation: [],
    loading: false,
    error: null,


}

export const chat = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.chats.push(action.payload);
        },
        deleteMessage: (state, action) => {
            const messageId = action.payload.messageId;

            console.log("xem adada", action.payload.messageId)
            state.chats = state.chats.filter((message) => message._id !== messageId);
        },
        updateMessageStatus: (state, action) => {
            const { messageId, status, seenBy } = action.payload;

            const message = state.chats.find(msg => msg._id === messageId);
            if (message) {
                message.status = status;
                if (!message.seenBy.includes(seenBy)) {
                    message.seenBy.push(seenBy);

                }
            }
        },
        updatelistchat: (state, action) => {
            const { data } = action.payload
            console.log("xem pay;pad", action.payload)
            console.log("xem data", data)


            const conversationIndex = state.conversation.findIndex(
                conv => conv.conversationId === data.conversationId
            );

            if (conversationIndex !== -1) {

                state.conversation[conversationIndex] = {
                    ...state.conversation[conversationIndex],
                    groupName: data.groupName
                };
            }

        },
    },

    extraReducers: (builder) => {
        builder

            //get list conversation
            .addCase(getConservationId.pending, (state) => {
                state.loading = true
            })
            .addCase(getConservationId.fulfilled, (state, action) => {
                state.loading = false
                state.conversation = action.payload.data

            })
            .addCase(getConservationId.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            //get all chat by conversation id
            .addCase(getMessageChat.pending, (state) => {
                state.loading = true
            })
            .addCase(getMessageChat.fulfilled, (state, action) => {
                state.loading = false
                state.chats = action.payload.data

            })
            .addCase(getMessageChat.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            //get all chat by conversation id
            .addCase(createConservation.pending, (state) => {
                state.loading = true
            })
            .addCase(createConservation.fulfilled, (state, action) => {
                state.loading = false
                state.conversation = [...state.conversation, action.payload.data]

            })
            .addCase(createConservation.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
            //voice
            .addCase(voice.pending, (state) => {
                state.loading = true
            })
            .addCase(voice.fulfilled, (state, action) => {
                state.loading = false


            })
            .addCase(voice.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            //delete conversation
            .addCase(deleteConversation.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteConversation.fulfilled, (state, action) => {
                state.loading = false
                state.conversation = state.conversation.filter(
                    conv => conv.conversationId !== action.payload.data._id
                );

            })
            .addCase(deleteConversation.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
    },
})
export const { addMessage, deleteMessage, updateMessageStatus, updatelistchat } = chat.actions;
export default chat.reducer