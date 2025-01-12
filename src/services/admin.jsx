
import axios from "../axios/axios";

//auth 
export const handleloginAdmin = (data) => {
    return axios.post("/admin/auth/login", data)
}

export const handleadminprofile = () => {
    return axios.get('/admin/auth/profile')
}
export const handleLogoutAdmin = () => {
    return axios.post('/admin/auth/logout');
}
export const handleDashboard = () => {
    return axios.get('/admin/dashboard/data')
}


export const handleAllUser = () => {
    return axios.get('/admin/dashboard/user')
}


export const handlePostAnalys = () => {
    return axios.get('/admin/dashboard/post')
}

// management user
export const handleGetAllUser = () => {
    return axios.get("/admin/user/all")
}

export const handleBanUser = (id, ban) => {
    return axios.put(`/admin/user/update/${id}`, { ban })
}

// management post 

export const handleGetAllPost = (page, limit) => {
    return axios.get(`/admin/post/all?page=${page}&limit=${limit}`)
}

export const handleHidePost = (id, hide) => {
    return axios.put(`/admin/post/${id}`, { hide })
}

export const handleAdminDeletePost = (id) => {
    return axios.delete(`/admin/post/delete/${id}`)
}
