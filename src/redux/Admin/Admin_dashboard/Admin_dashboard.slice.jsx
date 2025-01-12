import { createSlice } from "@reduxjs/toolkit";
import { getdata, getAllUser, getDataPost } from "./Admin_dashboard.thunk";
const initialState = {

    analyticsdata: [],
    loading: false,
    error: null,
    AllUser: [],
    dataPost: null

}

export const dashboard = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getdata.pending, (state) => {
                state.loading = true
            })
            .addCase(getdata.fulfilled, (state, action) => {
                state.loading = false
                state.analyticsdata = action.payload.data

            })
            .addCase(getdata.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            // analyst user
            .addCase(getAllUser.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.loading = false
                state.AllUser = action.payload.data

            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            // analyst post
            .addCase(getDataPost.pending, (state) => {
                state.loading = true
            })
            .addCase(getDataPost.fulfilled, (state, action) => {
                state.loading = false
                state.dataPost = action.payload.data

            })
            .addCase(getDataPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

    },
})
export const { } = dashboard.actions;
export default dashboard.reducer

