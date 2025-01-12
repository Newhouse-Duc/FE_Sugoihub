import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { validateRegisterSchema } from '../../validates/validates';
import Card from 'antd/es/card/Card';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/Auth/Auth.thunk';
import { setView } from '../../redux/Auth/Auth.slice';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Lock, LogIn } from 'lucide-react';
const Register = () => {
    const dispatch = useDispatch();
    const [daysInMonth, setDaysInMonth] = useState(31);

    const initialValuesRegister = {
        username: '',
        email: '',
        day: '',
        month: '',
        year: '',
        password: '',
        repassword: '',
    };

    const formik = useFormik({
        initialValues: initialValuesRegister,
        validationSchema: validateRegisterSchema,
        onSubmit: async (values) => {
            const { day, month, year, ...otherValues } = values;
            const birthDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const birthDate = new Date(birthDateString);

            const data = {
                ...otherValues,
                birthDate,
            };

            dispatch(register({ data }));
        },
    });

    useEffect(() => {
        const year = parseInt(formik.values.year, 10);
        const month = parseInt(formik.values.month, 10);

        if (month && year) {
            const days = new Date(year, month, 0).getDate();
            setDaysInMonth(days);
        } else if (month) {
            const days = new Date(2024, month, 0).getDate();
            setDaysInMonth(days);
        }
    }, [formik.values.month, formik.values.year]);

    const handleLogin = () => {
        dispatch(setView('LOGIN'));
    };


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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-md mx-auto"
        >
            <div className="space-y-6">
                <motion.div variants={itemVariants} className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Tham gia cộng đồng của chúng tôi
                    </p>
                </motion.div>

                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    {/* Username */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Tên người dùng"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                        {formik.touched.username && formik.errors.username && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm"
                            >
                                {formik.errors.username}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants} className="space-y-2">
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
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
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

                    {/* Date of Birth */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <div className="relative flex gap-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                name="day"
                                value={formik.values.day}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-1/3 pl-10 pr-2 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="" disabled hidden>Ngày</option>
                                {Array.from({ length: daysInMonth }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <select
                                name="month"
                                value={formik.values.month}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-1/3 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="" disabled hidden>Tháng</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <select
                                name="year"
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-1/3 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="" disabled hidden>Năm</option>
                                {Array.from({ length: 100 }, (_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(formik.touched.day && formik.errors.day) ||
                            (formik.touched.month && formik.errors.month) ||
                            (formik.touched.year && formik.errors.year) ? (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm"
                            >
                                {formik.errors.day || formik.errors.month || formik.errors.year}
                            </motion.div>
                        ) : null}
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants} className="space-y-2">
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
                                placeholder="Mật khẩu"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
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

                    {/* Confirm Password */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="repassword"
                                type="password"
                                value={formik.values.repassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Xác nhận mật khẩu"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                        {formik.touched.repassword && formik.errors.repassword && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm"
                            >
                                {formik.errors.repassword}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        type="submit"
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                        transform hover:scale-105 transition-all duration-200
                        hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
                    >
                        Đăng ký
                    </motion.button>
                </form>

                <motion.div
                    variants={itemVariants}
                    className="text-center text-sm"
                >
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="text-indigo-600 hover:text-purple-600 font-medium transition-colors duration-200"
                    >
                        Đăng nhập ngay
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Register;