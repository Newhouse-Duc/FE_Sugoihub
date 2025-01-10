import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { validateForgotPasswordSchema } from '../../validates/validates';
import { forgotPassword } from '../../redux/Auth/Auth.thunk';
import { setView, setEmail } from '../../redux/Auth/Auth.slice';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);

    const handleBack = () => {
        dispatch(setView('LOGIN'));
    };

    const initialValueEmail = {
        email: "",
    };

    const formik = useFormik({
        initialValues: initialValueEmail,
        validationSchema: validateForgotPasswordSchema,
        onSubmit: (data) => {
            console.log("check giá trị : ", data);
            dispatch(setEmail(data.email));
            dispatch(forgotPassword({ data }));
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
                className="w-full max-w-md   "
            >
                <div className="space-y-8">
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Quên Mật Khẩu
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Hãy nhập Email của bạn để gửi mã OTP xác thực đặt lại mật khẩu
                        </p>
                    </motion.div>

                    {/* Back Button */}
                    <motion.button
                        variants={itemVariants}
                        type="button"
                        onClick={handleBack}
                        className="flex items-center justify-center gap-2 text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay trở lại
                    </motion.button>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        {/* Email Field */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Địa chỉ Email
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
                                    placeholder="Email của bạn"
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

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                            text-white font-medium rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                            transform hover:scale-105 transition-all duration-200
                            hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2
                            ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            ) : (
                                'Xác nhận'
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
