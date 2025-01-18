import { createSlice } from "@reduxjs/toolkit";
import { newCommentPost, allCommentByPost, replyComment, likeComment, getReplyComment } from "./Comment.thunk";


const initialState = {

    comment: [],
    replyComment: [],
    loading: false,
    error: null,


}


export const comment = createSlice({
    name: 'commnet',
    initialState,
    reducers: {

        addComment: (state, action) => {
            state.replyComment.push(action.payload);
        },


    },

    extraReducers: (builder) => {
        builder

            //get list conversation
            .addCase(newCommentPost.pending, (state) => {
                state.loading = true
            })
            .addCase(newCommentPost.fulfilled, (state, action) => {
                state.loading = false
                state.comment = [...state.comment, ...action.payload.data]

            })
            .addCase(newCommentPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            .addCase(allCommentByPost.pending, (state) => {
                state.loading = true
            })
            .addCase(allCommentByPost.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload.data

            })
            .addCase(allCommentByPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            // reply comment : 
            .addCase(replyComment.pending, (state) => {
                state.loading = true
            })
            .addCase(replyComment.fulfilled, (state, action) => {
                state.loading = false
                console.log("xem a", action.payload.data)
                state.replyComment = [...state.replyComment, ...action.payload.data.replie];
                const replyCount = action.payload.data.firstReplyCount.replyCount;
                const targetId = action.payload.data.firstReplyCount._id;
                const updateComment = (comments) => {
                    return comments.map((comment) => {

                        if (comment._id === targetId) {

                            return {
                                ...comment,
                                replyCount: replyCount,
                            };
                        }
                        return comment;
                    });
                };


                state.comment = updateComment(state.comment);
                state.replyComment = updateComment(state.replyComment);
            })
            .addCase(replyComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })
            // reply comment : 
            .addCase(getReplyComment.pending, (state) => {
                state.loading = true
            })
            .addCase(getReplyComment.fulfilled, (state, action) => {
                state.loading = false
                state.replyComment = [...state.replyComment, ...action.payload.data];




            })
            .addCase(getReplyComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            // like comment
            .addCase(likeComment.pending, (state) => {
                state.loading = true
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                state.loading = false
                const { commentId, likesCount, isLiked } = action.payload.data;

                // Cập nhật cho comments gốc
                const commentIndex = state.comment.findIndex(
                    (comment) => comment._id === commentId
                );
                if (commentIndex !== -1) {
                    state.comment[commentIndex].likesCount = likesCount;
                    state.comment[commentIndex].isLiked = isLiked;
                }

                // Cập nhật cho reply comments
                const replyIndex = state.replyComment.findIndex(
                    (reply) => reply._id === commentId
                );
                if (replyIndex !== -1) {
                    state.replyComment[replyIndex].likesCount = likesCount;
                    state.replyComment[replyIndex].isLiked = isLiked;
                }
            })
            .addCase(likeComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

    },
})
export const { } = comment.actions;
export default comment.reducer



