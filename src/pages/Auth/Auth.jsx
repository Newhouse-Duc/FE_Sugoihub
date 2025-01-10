import React from 'react';
import Login from '../../components/auth/Login';
import Register from '../../components/auth/Register';
import ForgotPassword from '../../components/auth/ForgotPassword';
import VerifyOtpResetPassword from '../../components/auth/VerifyOtpResetPassword';
import ResetPassword from '../../components/auth/ResetPassword';
import { Card } from "antd";
import { motion, AnimatePresence } from 'framer-motion';
import VerifyOtp from '../../components/auth/VerifyOtp';
import { useDispatch, useSelector } from 'react-redux';


const Auth = () => {
    const dispatch = useDispatch();
    const currentView = useSelector((state) => state.auth.currentView);

    const renderAuthComponent = () => {
        switch (currentView) {
            case 'LOGIN':
                return <Login />;
            case 'REGISTER':
                return <Register />;
            case 'VERIFY':
                return <VerifyOtp />;
            case 'FORGOTPASSWORD':
                return <ForgotPassword />;
            case 'VERIFYRESETPASSWORD':
                return <VerifyOtpResetPassword />;
            case 'RESETPASSWORD':
                return <ResetPassword />;
            default:
                return <Login />;
        }
    };

    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        in: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        out: {
            opacity: 0,
            y: -20,
            scale: 0.95
        }
    };

    const pageTransition = {
        type: "spring",
        stiffness: 300,
        damping: 30
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row min-h-[600px]">
                        {/* Left Panel - Branding */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-center items-center text-white relative"
                        >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="text-6xl font-bold mb-4"
                                >
                                    Sugoi
                                    <span className="text-pink-400">Hub</span>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-lg text-gray-200"
                                >
                                    Mạng xã hội số 1 Việt Nam
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="mt-8 p-6 bg-white/10 backdrop-blur rounded-xl"
                                >
                                    <p className="text-sm">Kết nối • Chia sẻ • Khám phá</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Panel - Auth Forms */}
                        <div className="w-full md:w-1/2 p-8">
                            <Card className="bg-white/80 backdrop-blur shadow-xl rounded-xl overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentView}
                                        initial="initial"
                                        animate="in"
                                        exit="out"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                        className="p-6"
                                    >
                                        {renderAuthComponent()}
                                    </motion.div>
                                </AnimatePresence>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;