import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleCommentPost, handleGetAllCommentByPost, handleReplyComment, handleLikeComment, handleGetReplyComment } from '../../services/user'

export const newCommentPost = createAsyncThunk(
    'comment/post',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleCommentPost(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const allCommentByPost = createAsyncThunk(
    'comment/post/allcomment',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleGetAllCommentByPost(id)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const replyComment = createAsyncThunk(
    'comment/post/reply',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleReplyComment(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const likeComment = createAsyncThunk(
    'comment/reply/like',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleLikeComment(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const getReplyComment = createAsyncThunk(
    'comment/all/replycomment',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleGetReplyComment(id)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)