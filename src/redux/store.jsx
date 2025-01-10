
import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from './Auth/Auth.slice'
import FriendShipReducer from './FriendShip/FriendShip.slice'
import UserReducer from './User/User.slice'

import PostReducer from './Post/Post.slice'
import ChatSReducer from './Chat/Chat.sllice'
import CommentReducer from './Comment/Comment.slice'
import NotificationReducer from './Notification/Notification.slice'
import Admin_userReducer from './Admin/Admin_user/Admin_user.slice'
import Admin_postReducer from './Admin/Admin_post/Admin_post.slice'
export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        friendship: FriendShipReducer,
        userdetail: UserReducer,

        post: PostReducer,
        chat: ChatSReducer,
        comment: CommentReducer,
        notification: NotificationReducer,
        adminUser: Admin_userReducer,
        adminpost: Admin_postReducer
    },
})