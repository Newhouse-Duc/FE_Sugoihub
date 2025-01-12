import { createAsyncThunk } from "@reduxjs/toolkit";

import { handleDashboard, handleAllUser, handlePostAnalys } from "../../../services/admin";

export const getdata = createAsyncThunk(
    'admin/dashboard/data',
    async (_, { rejectWithValue }) => {
        try {
            return await handleDashboard()
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

)

export const getAllUser = createAsyncThunk(
    'admin/dashboard/user',
    async (_, { rejectWithValue }) => {
        try {
            return await handleAllUser()
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

)



export const getDataPost = createAsyncThunk(
    'admin/dashboard/post',
    async (_, { rejectWithValue }) => {
        try {
            return await handlePostAnalys()
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

)
