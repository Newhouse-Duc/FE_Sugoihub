import { createSlice } from "@reduxjs/toolkit";

import { allNotification, deleteNotification } from "./Notification.thunk";

const initialState = {

    allnotification: [],
    loading: false,
    error: null,


}

export const notification = createSlice({
    name: 'notification',
    initialState,
    reducers: {

        removeNotification: (state, action) => {
            state.allnotification = state.allnotification.filter(
                notification => notification._id !== action.payload
            );
        },
        markNotificationsAsReadOptimistic: (state, action) => {
            const notificationIds = action.payload;

            state.allnotification = state.allnotification.map(notification => {
                if (notificationIds.includes(notification._id)) {
                    return { ...notification, isRead: true };
                }
                return notification;
            });
        }


    },
    extraReducers: (builder) => {
        builder

            //get friendship
            .addCase(allNotification.pending, (state) => {
                state.loading = true
            })
            .addCase(allNotification.fulfilled, (state, action) => {
                state.loading = false
                state.allnotification = [...state.allnotification, ...action.payload.data]

            })
            .addCase(allNotification.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message

            })






    },
})
export const { markNotificationsAsReadOptimistic, removeNotification } = notification.actions;
export default notification.reducer