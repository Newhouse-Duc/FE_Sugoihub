import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleGetAllPost, handleAdminDeletePost, handleHidePost } from "../../../services/admin";

export const getAllPost = createAsyncThunk(
    'admin/post/all',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            return await handleGetAllPost(page, limit)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

)

export const deletePost = createAsyncThunk(
    'admin/post/delete',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleAdminDeletePost(id)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

)

export const hidePost = createAsyncThunk(
    'admin/post/ hide',
    async ({ id, hide }, { rejectWithValue }) => {
        try {
            return await handleHidePost(id, hide)

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)