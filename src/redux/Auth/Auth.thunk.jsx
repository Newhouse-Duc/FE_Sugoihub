import { createAsyncThunk } from '@reduxjs/toolkit'

import { message } from 'antd';
import { handleUpdatePassword, handleUpdateProfile, handlelogin, handleregister, handleverifyotp, handleprofile, handlerefreshtoken, handleLogout, handleSendOTP, handleListUser, handleForgotPassword, handleVerifyOtpResetPassword, handleResetPassWord, handleGetFriend }
    from '../../services/user';
import { handleloginAdmin, handleadminprofile } from '../../services/admin';


export const login = createAsyncThunk(
    'auth/login',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handlelogin(data)

        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }

)

export const loginAdmin = createAsyncThunk(
    'admin/auth/login',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleloginAdmin(data)
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
)


export const register = createAsyncThunk(
    'auth/register',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleregister(data)
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
)

export const verifyotp = createAsyncThunk(
    'auth/verifyotp',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleverifyotp(data)
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
)


export const userprofile = createAsyncThunk(
    'auth/profile',
    async (_, { rejectWithValue }) => {
        try {
            return await handleprofile();
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)

export const adminprofile = createAsyncThunk(
    'auth/admin/profile',
    async (_, { rejectWithValue }) => {
        try {
            return await handleadminprofile();
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)
export const refreshtoken = createAsyncThunk(
    'auth/refreshtoken',
    async (_, { rejectWithValue }) => {
        try {
            return await handlerefreshtoken();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const logoutuser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await handleLogout()
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const sendotp = createAsyncThunk(
    'auth/sendotp',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleSendOTP(data);
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)


export const listUser = createAsyncThunk(
    'auth/list user',
    async (_, { rejectWithValue }) => {
        try {
            return await handleListUser()

        } catch (error) {
            return rejectWithValue(error.response.data);
        }

    }
)


export const forgotPassword = createAsyncThunk(
    'account/forgotpassword',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleForgotPassword(data);
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)
export const verifyOtpResetPassword = createAsyncThunk(
    'account/password/verify',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleVerifyOtpResetPassword(data);
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)

export const resetPassword = createAsyncThunk(
    'account/password/reset',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleResetPassWord(data);
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
)

export const updateprofileuser = createAsyncThunk(
    'user/update user',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleUpdateProfile(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)



export const listfriend = createAsyncThunk(
    'user/list friend',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleGetFriend(id);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const changepassword = createAsyncThunk(
    "/user/change password",
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleUpdatePassword(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
