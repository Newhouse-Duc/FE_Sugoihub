import React from 'react'
import { useFormik } from 'formik';
import { validateLoginAdminSchema } from '../../../validates/validates';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../../redux/Auth/Auth.thunk';
import { useNavigate } from "react-router-dom";
const Admin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const initialvaluesloginadmin = {
        username: "",
        password: "",
    }
    const formik = useFormik({
        initialValues: initialvaluesloginadmin,
        validationSchema: validateLoginAdminSchema,
        onSubmit: async (data) => {
            console.log("chec data", data)
            const res = await dispatch(loginAdmin({ data })).unwrap();
            if (res.success) {
                navigate('/admin/dashboard')
            }
        }
    })

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
                <div className="p-8 rounded-lg shadow-xl w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-600">
                    <h2 className="text-4xl font-bold mb-6 text-center text-white tracking-wide">Admin Login</h2>
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        {/* Username Field */}
                        <label className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-3 text-gray-100 border border-transparent focus-within:border-blue-500 transition-all duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 text-gray-300">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input
                                id="username"
                                type="text"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                                placeholder="Tài khoản"
                            />
                        </label>
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-red-500 text-sm">{formik.errors.username}</div>
                        )}

                        {/* Password Field */}
                        <label className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-3 text-gray-100 border border-transparent focus-within:border-blue-500 transition-all duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 text-gray-300">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <input
                                id="password"
                                type="password"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                                placeholder="Mật khẩu"
                            />
                        </label>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-sm">{formik.errors.password}</div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>


        </>
    )
}

export default Admin