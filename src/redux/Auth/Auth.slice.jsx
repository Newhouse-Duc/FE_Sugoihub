import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import { changepassword, logoutadmin, login, register, verifyotp, userprofile, refreshtoken, logoutuser, sendotp, listUser, forgotPassword, verifyOtpResetPassword, resetPassword, updateprofileuser }
    from './Auth.thunk';
import { loginAdmin, adminprofile } from './Auth.thunk';

const initialState = {
    currentView: 'LOGIN',
    isLoading: false,
    userinfor: null,
    error: null,
    admininfor: null,
    emailverify: null,
    isAuthenticated: false,
    isAdminAuthenticated: false,
    listUser: [],
    listFriend: [],
    isWait: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setView: (state, action) => {
            state.currentView = action.payload;
        },

        setEmail: (state, action) => {
            state.emailverify = action.payload;
        },
        removeFriend: (state, action) => {
            const idToRemove = action.payload;
            state.userinfor.friends = state.userinfor.friends.filter(
                friendId => friendId !== idToRemove
            );
        },

    },
    extraReducers: (builder) => {
        builder

            //login user
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.userinfor = action.payload.data
                state.isAuthenticated = true;
                message.success(action.payload.message)

            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false;
                state.error = action.error.message
                if (action.payload && action.payload.data) {
                    state.emailverify = action.payload.data.email;
                    if (action.payload.data.verify === false) {
                        state.currentView = 'VERIFY';
                    }
                }
            })


            // logout user
            .addCase(logoutuser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logoutuser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false;
                message.success(action.payload.message)
                state.userinfor = null
            })
            .addCase(logoutuser.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false;
                state.error = action.error.message
            })

            // logout admin

            .addCase(logoutadmin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logoutadmin.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAdminAuthenticated = false;
                message.success(action.payload.message)
                state.admininfor = null
            })
            .addCase(logoutadmin.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false;
                state.error = action.error.message
            })
            // send otp 

            .addCase(sendotp.pending, (state) => {
                state.isLoading = true
            })
            .addCase(sendotp.fulfilled, (state, action) => {
                state.isLoading = false
                message.success(action.payload.message)
            })
            .addCase(sendotp.rejected, (state, action) => {
                state.isLoading = false

                state.error = action.error.message
            })



            //login admin
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.isAdminAuthenticated = false
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAdminAuthenticated = true
                state.admininfor = action.payload.data
                message.success(action.payload.message)

            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false
                state.isAdminAuthenticated = false
                state.error = action.error.message
            })
            // get profile
            .addCase(userprofile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(userprofile.fulfilled, (state, action) => {
                state.isLoading = false
                state.userinfor = action.payload.data
                state.isAuthenticated = true;


            })
            .addCase(userprofile.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false;
                state.error = action.error.message

            })

            // admin profile

            .addCase(adminprofile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(adminprofile.fulfilled, (state, action) => {
                state.isLoading = false
                state.admininfor = action.payload.data
                state.isAdminAuthenticated = true;


            })
            .addCase(adminprofile.rejected, (state, action) => {
                state.isLoading = false
                state.isAdminAuthenticated = false;
                state.error = action.error.message

            })



            // refresh token
            .addCase(refreshtoken.pending, (state) => {
                state.isLoading = true
            })
            .addCase(refreshtoken.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true;

            })
            .addCase(refreshtoken.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.error = action.error.message
            })

            // register
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                message.success(action.payload.message)
                if (action.payload.success) {
                    state.currentView = 'VERIFY'
                }
                state.emailverify = action.payload.user.email

            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })
            // verify otp
            .addCase(verifyotp.pending, (state) => {
                state.isLoading = true
            })
            .addCase(verifyotp.fulfilled, (state, action) => {
                state.isLoading = false
                message.success(action.payload.message)
                if (action.payload?.success) {
                    state.currentView = 'LOGIN';
                }
            })
            .addCase(verifyotp.rejected, (state, action) => {
                state.isLoading = false

            })


            // forgot password

            .addCase(forgotPassword.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false
                message.success(action.payload.message)
                if (action.payload?.success) {
                    state.currentView = 'VERIFYRESETPASSWORD';
                }
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload.message)
            })

            // verify otp reset passowrd
            .addCase(verifyOtpResetPassword.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(verifyOtpResetPassword.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.success) {
                    message.success(action.payload.message)
                    state.currentView = 'RESETPASSWORD';
                }
            })
            .addCase(verifyOtpResetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload.message
            })

            // reset password

            .addCase(resetPassword.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload?.success) {
                    message.success(action.payload.message)
                    state.currentView = 'LOGIN';
                }
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload.message)
            })


            // get list user
            .addCase(listUser.pending, (state) => {
                state.isWait = true
            })

            .addCase(listUser.fulfilled, (state, action) => {
                state.isWait = false

                if (action.payload?.success) {
                    state.listUser = action.payload.data
                }
            })
            .addCase(listUser.rejected, (state, action) => {
                state.isWait = false
                message.error(action.payload.message)
            })



            // update password 

            .addCase(changepassword.pending, (state) => {
                state.isLoading = true
            })

            .addCase(changepassword.fulfilled, (state, action) => {

                state.isLoading = false
                if (action.payload.success) {

                    message.success("Cập nhật thông tin thành công")
                }

            })
            .addCase(changepassword.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload.message)
            })
            // update profile user
            .addCase(updateprofileuser.pending, (state) => {
                state.isLoading = true
            })

            .addCase(updateprofileuser.fulfilled, (state, action) => {


                if (action.payload.success) {
                    state.userinfor = action.payload.data
                    message.success("Cập nhật thông tin thành công")
                }

            })
            .addCase(updateprofileuser.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload.message)
            })

    },
})
export const { setView, setEmail, removeFriend } = authSlice.actions;
export default authSlice.reducer