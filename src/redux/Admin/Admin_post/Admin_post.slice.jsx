import { createSlice } from "@reduxjs/toolkit";
import { getAllPost, deletePost, hidePost } from "./Admin_post.thunk";
import { message } from 'antd'
const initialState = {

    posts: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 5,
    },
    loading: false,
    error: null,


}

export const admin_post = createSlice({
    name: 'admin_post',
    initialState,
    reducers: {
        updateHidePost(state, action) {
            const { id, hide } = action.payload;
            console.log("xem nào ", action.payload)
            const postIndex = state.posts.findIndex(post => post._id === id);
            if (postIndex >= 0) {
                state.posts[postIndex].hide = hide;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            //get all chat by conversation id
            .addCase(getAllPost.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.loading = false
                state.posts = action.payload.data
                state.pagination = action.payload.pagination;

            })
            .addCase(getAllPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
            //deletepost
            .addCase(deletePost.pending, (state) => {
                state.loading = true
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.success) {
                    state.posts = state.posts.filter((post) => post._id !== action.payload.data);
                    message.success("Xóa bài viết thành công")
                }

            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false
                if (!action.payload.success) {
                    message.error(action.error.message)
                }

            })

            //hide post
            .addCase(hidePost.pending, (state) => {
                state.loading = true
            })
            .addCase(hidePost.fulfilled, (state, action) => {
                state.loading = false
                message.success(action.payload.message)
            })
            .addCase(hidePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})
export const { updateHidePost } = admin_post.actions;
export default admin_post.reducer
