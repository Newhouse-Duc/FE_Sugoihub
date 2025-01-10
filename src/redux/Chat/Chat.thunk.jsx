import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleGetConservation, handleGetMessageChat, handleUploadImageChat, handleCreateConservation, voicechat } from '../../services/user'



export const getConservationId = createAsyncThunk(
    'chat/conversation',
    async (_, { rejectWithValue }) => {
        try {
            return await handleGetConservation()
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getMessageChat = createAsyncThunk(
    'chat/conversation/message',
    async ({ conversationId }, { rejectWithValue }) => {
        try {
            return await handleGetMessageChat(conversationId)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const uploadImageChat = createAsyncThunk(
    'chat/upload/image',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleUploadImageChat(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const createConservation = createAsyncThunk(
    'chat/conversation/create',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleCreateConservation(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)



export const voice = createAsyncThunk(
    'chat/voice',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await voicechat(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
