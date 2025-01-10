import { createSlice } from "@reduxjs/toolkit";

import { userdetail } from "./User.thunk";

const initialState = {

    detailUser: null,
    loading: false,
    error: null,


}

export const UserDetail = createSlice({
    name: 'user detail',
    initialState,
    reducers: {



    },
    extraReducers: (builder) => {
        builder

            //get friendship
            .addCase(userdetail.pending, (state) => {
                state.loading = true
            })
            .addCase(userdetail.fulfilled, (state, action) => {
                state.loading = false
                state.detailUser = action.payload.data

            })
            .addCase(userdetail.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })


    },
})
export const { } = UserDetail.actions;
export default UserDetail.reducer

