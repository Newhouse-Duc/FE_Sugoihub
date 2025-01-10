import { createSlice } from "@reduxjs/toolkit";
import { addFriend, allfriendship, updateFriend } from "./FriendShip.thunk";
import { message } from "antd"
const initialState = {

    friends: [],
    receivedRequests: [],
    sentRequests: [],
    loading: false,
    error: null,


}

export const friendship = createSlice({
    name: 'friendship',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            //get friendship
            .addCase(allfriendship.pending, (state) => {
                state.loading = true
            })
            .addCase(allfriendship.fulfilled, (state, action) => {
                state.loading = false
                state.receivedRequests = action.payload.data.receivedRequests
                state.sentRequests = action.payload.data.sentRequests
            })
            .addCase(allfriendship.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            // add friend
            .addCase(addFriend.pending, (state) => {
                state.loading = true
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                state.loading = false,

                    message.success(action.payload.message)
            })
            .addCase(addFriend.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })

            // update friend
            .addCase(updateFriend.pending, (state) => {
                state.loading = true
            })
            .addCase(updateFriend.fulfilled, (state, action) => {
                state.loading = false
                message.success(action.payload.message)
            })
            .addCase(updateFriend.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })





    },
})
export const { } = friendship.actions;
export default friendship.reducer
