import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    handleCreateNewPost,
    handleGetAllPost,
    handleGetMyPost,
    handleAllPostGues,
    handleLikePost,
    handleDeleteMyPost,
    handleUpdatePost
} from '../../services/user'

export const newPost = createAsyncThunk(
    'post/create',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleCreateNewPost(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const allPost = createAsyncThunk(
    'post/all',
    async ({ userId }, { rejectWithValue }) => {
        try {
            return await handleGetAllPost(userId);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const myPost = createAsyncThunk(
    'post/my post',
    async ({ userId }, { rejectWithValue }) => {
        try {
            return await handleGetMyPost(userId);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const allPostGues = createAsyncThunk(
    'post/all post/ gues',
    async ({ id, userid }, { rejectWithValue }) => {
        try {
            return await handleAllPostGues(id, userid);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const likePost = createAsyncThunk(
    'post/like post',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleLikePost(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deletePost = createAsyncThunk(
    'post/delete',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleDeleteMyPost(id)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const updatePost = createAsyncThunk(
    'post/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await handleUpdatePost(id, data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)