import React, { useEffect, useState } from 'react'
import { Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { message } from "antd"
import { validateResetPasswordSchema } from '../../validates/validates';
import { useFormik } from 'formik';
import { resetPassword } from '../../redux/Auth/Auth.thunk';
import { Button } from 'antd';
import { setView, setEmail } from '../../redux/Auth/Auth.slice';

const ResetPassword = () => {

    const dispatch = useDispatch()
    const isLoading = useSelector((state) => state.auth.isLoading)
    const emailverify = useSelector((state) => state.auth.emailverify)
    const handleBack = () => {
        dispatch(setView('VERIFYRESETPASSWORD'))
    }
    const initialValueEmail = {
        email: emailverify,
        newpassword: "",
        repassword: "",
    }


    const formik = useFormik({
        initialValues: initialValueEmail,
        validationSchema: validateResetPasswordSchema,
        onSubmit: async (data) => {


            console.log("check giá trị : ", data);

            dispatch(resetPassword({ data }))


        }
    })

    return (
        <>
            <div className=" bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="px-6 py-8 sm:px-8">
                        {/* Header Section */}
                        <div className="text-center space-y-3 mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Cài lại mật khẩu để đăng nhập</h1>
                            <p className="text-[15px] text-gray-500 leading-relaxed">
                                Hãy nhập mã xác minh được gửi về email mà bạn đăng kí
                            </p>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="mb-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
                        >
                            <span>←</span> Quay lại
                        </button>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Password Fields in vertical layout */}
                            <div className="space-y-4">
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        id="newpassword"
                                        type="text"
                                        placeholder="••••••••"
                                        value={formik.values.newpassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full px-3 py-2 rounded-md border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent transition duration-200 bg-white"
                                    />
                                    {formik.touched.newpassword && formik.errors.newpassword && (
                                        <div className="text-red-500 text-sm">{formik.errors.newpassword}</div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="repassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nhập lại mật khẩu
                                    </label>
                                    <input
                                        id="repassword"
                                        type="text"
                                        value={formik.values.repassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 rounded-md border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent transition duration-200 bg-white"
                                    />
                                    {formik.touched.repassword && formik.errors.repassword && (
                                        <div className="text-red-500 text-sm">{formik.errors.repassword}</div>
                                    )}
                                </div>
                            </div>

                            {/* Error Messages */}
                            {formik.errors.otp && formik.touched.otp && (
                                <div className="text-red-500 text-sm text-center">
                                    {formik.errors.otp}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                text-white font-medium rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 transition duration-200"
                            >
                                Xác nhận
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword