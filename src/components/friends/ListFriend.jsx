import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const ListFriend = ({ listfriend }) => {
    const navigate = useNavigate()
    const userinfor = useSelector((state) => state.auth.userinfor);

    const handleUserClick = (userId) => {

        navigate(userId === userinfor._id ? "/account" : `/user/${userId}`);
        window.location.reload();
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto p-4 bg-slate-300 border rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {listfriend.map((friend) => (
                    <motion.div
                        key={friend._id}
                        variants={item}
                        whileHover={{
                            scale: 1.03,
                            translateY: -5,
                            transition: { type: "spring", stiffness: 400 }
                        }}
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                    >
                        <motion.div
                            className="relative cursor-pointer"
                            onClick={() => handleUserClick(friend._id)}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.img
                                src={friend.avatar?.url || 'https://avatar.iran.liara.run/public/4'}
                                alt={friend.username}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                whileHover={{
                                    scale: 1.1,
                                    borderColor: '#3b82f6',
                                    transition: { duration: 0.2 }
                                }}
                            />
                        </motion.div>
                        <div className="ml-3 flex-1">
                            <h3 className="font-medium text-gray-900 truncate">
                                {friend.username}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};
export default ListFriend