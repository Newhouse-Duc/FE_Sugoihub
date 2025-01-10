import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { validateVerifyOtpSchema } from '../../validates/validates';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpResetPassword, forgotPassword } from '../../redux/Auth/Auth.thunk';
import { setView } from '../../redux/Auth/Auth.slice';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyOtpResetPassword = () => {
    const dispatch = useDispatch();
    const emailverify = useSelector((state) => state.auth.emailverify);
    const [loading, setLoading] = useState(false);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const formik = useFormik({
        initialValues: {
            otp: ['', '', '', '', '', '']
        },
        validationSchema: validateVerifyOtpSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const otpValue = values.otp.join('');
                const data = {
                    email: emailverify,
                    otp: otpValue
                };

                const res = await dispatch(verifyOtpResetPassword({ data })).unwrap();

                if (res.success) {
                    dispatch(setView('RESETPASSWORD'));
                }
            } catch (error) {

                message.error('Lỗi xác thực OTP');
            } finally {
                setLoading(false);
            }
        }
    });

    const handleKeyDown = (e, index) => {
        if (
            !/^[0-9]{1}$/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Tab' &&
            !e.metaKey
        ) {
            e.preventDefault();
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (index > 0 && !formik.values.otp[index]) {
                const newOtp = [...formik.values.otp];
                newOtp[index - 1] = '';
                formik.setFieldValue('otp', newOtp);
                inputRefs[index - 1].current?.focus();
            }
        }
    };

    const handleInput = (e, index) => {
        const value = e.target.value;
        if (value && !/^[0-9]{1}$/.test(value)) return;

        const newOtp = [...formik.values.otp];
        newOtp[index] = value;
        formik.setFieldValue('otp', newOtp);

        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleSentOTP = async () => {
        if (emailverify) {
            dispatch(forgotPassword({ data: { email: emailverify } }));
            message.success('Mã OTP đã được gửi lại!');
        } else {
            message.error("Thiếu email");
        }
    };

    const handleBack = () => {
        dispatch(setView('FORGOTPASSWORD'));
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[600px]">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md "
            >
                <div className="space-y-8">
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhập mã xác minh</h1>
                        <p className="text-sm text-gray-500">
                            Hãy nhập mã xác minh được gửi về email mà bạn đăng ký
                        </p>
                    </motion.div>

                    {/* Back Button */}
                    <motion.button
                        variants={itemVariants}
                        type="button"
                        onClick={handleBack}
                        className="flex items-center justify-center gap-2 text-indigo-600 hover:text-purple-600 transition-colors duration-200 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Quay lại
                    </motion.button>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
                            {formik.values.otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    name={`otp.${index}`}
                                    className="w-10 h-10 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold text-gray-900 
                 bg-gray-50 border-2 border-gray-200 rounded-lg
                 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100
                 transition-all duration-200"
                                    maxLength={1}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    pattern="\d*"
                                />
                            ))}
                        </motion.div>

                        {/* Error Message */}
                        {formik.errors.otp && formik.touched.otp && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm text-center"
                            >
                                {formik.errors.otp}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                                         text-white font-medium rounded-md 
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                         focus:ring-offset-2 transition duration-200 flex items-center justify-center 
                                         ${loading ? 'cursor-not-allowed opacity-50' : 'hover:from-indigo-700 hover:to-purple-700'}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            ) : (
                                'Xác nhận'
                            )}
                        </motion.button>

                        {/* Resend OTP */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center text-gray-500 text-sm"
                        >
                            Bạn không thấy mã xác minh?{' '}
                            <button
                                type="button"
                                onClick={handleSentOTP}
                                className="font-medium text-indigo-500 hover:text-indigo-600 
                                         focus:outline-none focus:underline"
                            >
                                Gửi lại mã xác minh
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtpResetPassword;
