import { createSlice } from "@reduxjs/toolkit";
import {
    newPost,
    allPost,
    myPost,
    allPostGues,
    likePost,
    deletePost,
    updatePost,
} from "./Post.thunk";
const initialState = {

    allpost: [],
    loading: false,
    loadingpost: false,
    error: null,


}

export const post = createSlice({
    name: 'post',
    initialState,
    reducers: {


        removePostById: (state, action) => {
            state.allpost = state.allpost.filter(post => post.id !== action.payload.id);
        },


    },
    extraReducers: (builder) => {
        builder

            //get friendship
            .addCase(newPost.pending, (state) => {
                state.loading = true
            })
            .addCase(newPost.fulfilled, (state, action) => {
                state.loading = false


            })
            .addCase(newPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            // all post
            .addCase(allPost.pending, (state) => {
                state.loadingpost = true
            })
            .addCase(allPost.fulfilled, (state, action) => {
                state.loadingpost = false,
                    state.allpost = action.payload.data


            })
            .addCase(allPost.rejected, (state, action) => {
                state.loadingpost = false
                state.error = action.error.message

            })
            // my post
            .addCase(myPost.pending, (state) => {
                state.loadingpost = true
            })
            .addCase(myPost.fulfilled, (state, action) => {
                state.loadingpost = false,
                    state.allpost = action.payload.data


            })
            .addCase(myPost.rejected, (state, action) => {
                state.loadingpost = false
                state.error = action.error.message

            })
            // all post gues
            .addCase(allPostGues.pending, (state) => {
                state.loadingpost = true
            })
            .addCase(allPostGues.fulfilled, (state, action) => {
                state.loadingpost = false,
                    state.allpost = action.payload.data


            })
            .addCase(allPostGues.rejected, (state, action) => {
                state.loadingpost = false
                state.error = action.error.message

            })

            // like post 
            .addCase(likePost.pending, (state) => {
                state.loading = true
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.loading = false;
                const { likesCount, isLiked, postId } = action.payload.data;
                console.log("xem log : ", action.payload.data)
                state.allpost = state.allpost.map((post) =>
                    post._id === postId
                        ? { ...post, likesCount, isLiked }
                        : post
                );

            })
            .addCase(likePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
            //delete post
            .addCase(deletePost.pending, (state) => {
                state.loading = true
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false,
                    state.allpost = state.allpost.filter(post => post._id !== action.payload.data._id);


            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
            //update post
            .addCase(updatePost.pending, (state) => {
                state.loading = true
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false
                const { content, images, videos, visibility, _id } = action.payload.data;
                console.log("xem log : ", action.payload.data)
                state.allpost = state.allpost.map((post) =>
                    post._id === _id
                        ? { ...post, content, images, videos, visibility }
                        : post
                );

            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })



    },
})
export const { removePostById } = post.actions;
export default post.reducer