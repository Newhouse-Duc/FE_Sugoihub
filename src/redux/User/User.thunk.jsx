import { handleDetailUser } from "../../services/user";
import { createAsyncThunk } from '@reduxjs/toolkit'


export const userdetail = createAsyncThunk(
    'user/detail user',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleDetailUser(id);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
