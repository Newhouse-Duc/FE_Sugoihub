import axios from "../axios/axios";


// auth
export const handlelogin = (data) => {
    return axios.post("/auth/login", data)
}

export const handleregister = (data) => {
    return axios.post("/auth/register", data)
}

export const handleverifyotp = (data) => {
    return axios.post("/auth/verifyotp", data)
}

export const handleprofile = () => {
    return axios.get('/auth/profile')
}


export const handlerefreshtoken = () => {
    return axios.post('/auth/refresh')
}

export const handleLogout = () => {
    return axios.post('/auth/logout')
}

export const handleSendOTP = (data) => {
    return axios.post("/auth/sendotp", data)
}

export const handleForgotPassword = (data) => {
    return axios.post("/account/password/reset/sentotp", data)
}


export const handleVerifyOtpResetPassword = (data) => {
    return axios.post("/account/password/verify", data)
}

export const handleResetPassWord = (data) => {
    return axios.put("/account/password/reset", data)
}


export const handleUpdateProfile = (data) => {
    return axios.put("/account/update", data)
}

export const handleUpdatePassword = (data) => {
    return axios.patch("/account/password", data)
}
// user
export const handleListUser = () => {
    return axios.get("/auth/getuser")
}

export const handleDetailUser = (id) => {
    return axios.get(`/user/${id}`)
}
export const handleGetFriend = (id) => {
    return axios.get(`/auth/${id}/friend`)
}



// friendship 


export const handleAddFriend = (data) => {
    return axios.post("/friend/addfriend", data)
}


export const handleAllFriendShip = (id) => {
    return axios.get(`/friend/friendship/${id}`)
}


export const handleUpdateFriendShip = (data) => {

    return axios.put("/friend/updatefriend", data)
}

export const handleDeleteFriend = (data) => {
    console.log("daaa dâu r ", data)
    return axios.delete("/friend/remove", { data })
}


// post 
export const handleCreateNewPost = (data) => {
    return axios.post("/post/create", data)
}

export const handleGetAllPost = (userId) => {

    return axios.get(`/post/all/${userId}`)
}


export const handleGetMyPost = (userId) => {
    return axios.get(`/post/user/${userId}`)
}

export const handleAllPostGues = (id, userid) => {
    return axios.get(`/post/guest/allpost/${id}/${userid}`)
}
export const handleDeleteMyPost = (id) => {
    return axios.delete(`/post/delete/${id}`)
}

export const handleLikePost = (data) => {
    return axios.post("/post/like", data)
}
export const handleUpdatePost = (id, data) => {
    return axios.put(`/post/${id}`, data)
}
export const handleGetHistoryPost = (id) => {
    return axios.get(`/post/history/${id}`)
}


// chat 

export const handleGetConservation = () => {
    return axios.get("/chat/listchat")
}


export const handleGetMessageChat = (conversationId) => {
    return axios.get(`/chat/user/${conversationId}`)
}


export const handleUploadImageChat = (data) => {
    return axios.post("/chat/upload/image", data)
}
export const handleCreateConservation = (data) => {
    return axios.post("/chat/conversation", data)
}
export const voicechat = (data) => {
    return axios.post("/chat/voice", data)
}

export const handleDeleteConversation = (id) => {
    return axios.delete(`/chat/conversation/${id}`)
}

// comment 

export const handleCommentPost = (data) => {
    return axios.post("/comment/post", data)
}


export const handleGetAllCommentByPost = (id) => {
    return axios.get(`/comment/post/allcomment/${id}`)
}


export const handleGetReplyComment = (id) => {
    return axios.get(`/comment/post/replycomment/${id}`)
}

export const handleReplyComment = (data) => {
    return axios.post("/comment/reply", data)
}


export const handleLikeComment = (data) => {
    return axios.post("/comment/like", data)
}


// notification 

export const handleGetNotification = (skip, limit, allnotify) => {
    console.log("xem đi bên này : ", allnotify)
    return axios.get("/notification/getAll", {
        params: {
            limit: limit,
            skip: skip,
            allnotify: allnotify,
        }
    })
}

export const handleMaskReadNotification = (data) => {
    return axios.patch("/notification/mask-read", data)
}



export const handleDeleteNotification = (id) => {
    return axios.delete(`/notification/delete/${id}`)
}