import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { validateLoginSchema } from '../../validates/validates';
import { login } from '../../redux/Auth/Auth.thunk';
import { setView } from '../../redux/Auth/Auth.slice';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const dispatch = useDispatch();

    const intialValueLogin = {
        email: "",
        password: ""
    }

    const handleRegister = () => {
        dispatch(setView('REGISTER'))
    }

    const handleForgotPassword = () => {
        dispatch(setView('FORGOTPASSWORD'))
    }

    const formik = useFormik({
        initialValues: intialValueLogin,
        validationSchema: validateLoginSchema,
        onSubmit: (data) => {

            dispatch(login({ data }))
        }
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[600px]">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md"
            >
                <div className="space-y-8">
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Đăng nhập
                        </h1>

                    </motion.div>

                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        {/* Email Field */}

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">

                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 
                                    focus:border-transparent transition duration-200 
                                    bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm"
                                >
                                    {formik.errors.email}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Password Field */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 
                                    focus:border-transparent transition duration-200 
                                    bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm"
                                >
                                    {formik.errors.password}
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            type="submit"
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                            text-white font-medium rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                            transform hover:scale-105 transition-all duration-200
                            hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <LogIn className="h-5 w-5" />
                                Đăng nhập
                            </span>
                        </motion.button>
                    </form>

                    <motion.div
                        variants={itemVariants}
                        className="text-center text-sm"
                    >
                        <span className="text-gray-600">
                            Chưa có tài khoản?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={handleRegister}
                            className="text-indigo-600 hover:text-purple-600 font-medium transition-colors duration-200"
                        >
                            Đăng ký ngay
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;