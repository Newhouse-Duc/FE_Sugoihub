import { createSlice } from '@reduxjs/toolkit'
import { allUser, banUser } from './Admin_user.thunk'
import { message } from 'antd'
const initialState = {
    user: [],
    loading: false
}

export const adminUserSlice = createSlice({
    name: 'admin_user',
    initialState,
    reducers: {
        updateUserBan(state, action) {
            const { id, ban } = action.payload;
            const userIndex = state.user.findIndex(user => user._id === id);
            if (userIndex >= 0) {
                state.user[userIndex].ban = ban;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(allUser.pending, (state) => {
                state.loading = true
            })
            .addCase(allUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data

            })
            .addCase(allUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            // ban user
            .addCase(banUser.pending, (state) => {
                state.loading = true
            })
            .addCase(banUser.fulfilled, (state, action) => {
                state.loading = false
                message.success(action.payload.message)
            })
            .addCase(banUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })


    },
})
export const { updateUserBan } = adminUserSlice.actions;
export default adminUserSlice.reducer