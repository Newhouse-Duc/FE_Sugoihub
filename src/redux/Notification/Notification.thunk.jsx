import { createAsyncThunk } from '@reduxjs/toolkit'

import { handleGetNotification, handleMaskReadNotification, handleDeleteNotification } from "../../services/user";


export const allNotification = createAsyncThunk(
    'notification/all',
    async ({ skip, limit }, { rejectWithValue }) => {
        try {
            return await handleGetNotification(skip, limit);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const maskReadNotifications = createAsyncThunk(
    'notification/maskRead',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleMaskReadNotification(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleDeleteNotification(id);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
