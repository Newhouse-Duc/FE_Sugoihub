import { createAsyncThunk } from '@reduxjs/toolkit'

import { handleGetAllUser, handleBanUser } from '../../../services/admin'

export const allUser = createAsyncThunk(
    'admin/list user',
    async (_, { rejectWithValue }) => {
        try {
            return await handleGetAllUser()

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const banUser = createAsyncThunk(
    'admin/ban user',
    async ({ id, ban }, { rejectWithValue }) => {
        try {
            return await handleBanUser(id, ban)

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)