import React from 'react'
import { useFormik } from 'formik';
import { validateLoginAdminSchema } from '../../../validates/validates';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../../redux/Auth/Auth.thunk';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-full h-full">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-8 rounded-lg shadow-xl w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-600 relative"
            >
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold mb-6 text-center text-white tracking-wide"
                >
                    Admin Login
                </motion.h2>
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    {/* Username Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-3 text-gray-100 border border-transparent focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
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
                            <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                        )}
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-3 text-gray-100 border border-transparent focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
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
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                        Đăng nhập
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default Admin