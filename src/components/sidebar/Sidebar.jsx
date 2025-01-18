import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from "antd"
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
const Sidebar = () => {
    const navigate = useNavigate()
    const mainMenuItems = [
        { icon: 'bi bi-person-fill', label: 'Trang cá nhân', path: '/account' },
        { icon: 'bi bi-chat-dots-fill', label: 'Tin nhắn', path: '/messages' },

        { icon: 'bi bi-person-plus-fill', label: 'Lời mời kết bạn', path: '/friendrequest' },
        { icon: 'bi bi-gear-fill', label: 'Cài đặt', path: '/setting' },

    ];





    const userinfor = useSelector((state) => state.auth.userinfor)




    return (

        <>
            <div className="drawer xl:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

                <div className="drawer-side min-h-screen">
                    <div className="bg-gradient-to-b from-slate-200 to-slate-50 w-64 min-h-full px-4 py-6 shadow-xl">
                        {/* User Profile Section */}
                        <div className="flex items-center gap-4 px-2 py-4 mb-6 border-b border-slate-600">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="text-4xl font-bold mb-4 text-gray-800"
                            >
                                Sugoi
                                <span className="text-pink-400">Hub</span>
                            </motion.div>

                        </div>

                        {/* Navigation Menu */}
                        <ul className="space-y-2">
                            {mainMenuItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center px-4 py-3 text-[#646666] hover:bg-[#00CDB8] rounded-lg transition-all duration-200 group"
                                    >
                                        <i className={`${item.icon} mr-3 text-lg group-hover:text-white`}></i>
                                        <span className="font-medium group-hover:text-white">
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;