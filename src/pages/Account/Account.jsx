import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myPost } from "../../redux/Post/Post.thunk";
import PostList from "../../components/Post/PostList";
import { motion } from "framer-motion";
import Profile from "../../components/modals/Profile";
import { Avatar } from "antd";
import { UserOutlined, MailOutlined, LinkOutlined } from "@ant-design/icons";
import { listfriend } from "../../redux/FriendShip/FriendShip.thunk";
import ListFriend from "../../components/friends/ListFriend";

const Account = () => {
    const dispatch = useDispatch();
    const userinfor = useSelector((state) => state.auth.userinfor);
    const allpost = useSelector((state) => state.post.allpost);
    const [modalprofile, setModalProfile] = useState(false)
    const [showlistfriend, setShowListFriend] = useState(false)
    const friends = useSelector((state) => state.friendship.friends)
    useEffect(() => {
        if (userinfor?._id) {
            dispatch(listfriend({ id: userinfor._id }))
        }
    }, [userinfor._id]);
    useEffect(() => {
        if (userinfor?._id) {
            dispatch(myPost({ userId: userinfor._id }));
        }
    }, [userinfor._id]);
    const handleshowpost = () => {
        setShowListFriend(false)
    }
    const handleshowfriend = () => {
        setShowListFriend(true)
    }
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const avatarVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.3 }
        }
    };
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full p-6 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] hover:shadow-xl transition-shadow duration-300"
            >
                <Profile isOpen={modalprofile} onClose={() => setModalProfile(false)} />

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center mb-6"
                >
                    <motion.div
                        className="mb-4"
                        variants={avatarVariants}
                        whileHover="hover"
                    >
                        <Avatar
                            size={120}
                            src={userinfor?.avatar?.url || "https://avatar.iran.liara.run/public/4"}
                            icon={<UserOutlined />}
                            alt="User Avatar"
                            className="border-4 border-white shadow-lg"
                        />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-semibold text-gray-800 mb-2"
                    >
                        {userinfor?.username}
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-gray-600 flex items-center"
                    >
                        <MailOutlined className="mr-2" /> {userinfor?.email}
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-6"
                >
                    <h1 className="text-lg font-semibold text-gray-800 mb-3">Tiểu sử</h1>
                    <p className="text-sm text-gray-700 mb-4">
                        {userinfor?.bio || "Chưa có tiểu sử."}
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-200 my-4"
                />

                <motion.ul
                    variants={itemVariants}
                    className="flex justify-center md:justify-start gap-8"
                >
                    <motion.li
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <a className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center  cursor-pointer" onClick={handleshowpost}>
                            <LinkOutlined className="mr-2" /> Bài viết
                        </a>
                    </motion.li>
                    <motion.li
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <a className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center cursor-pointer" onClick={handleshowfriend}>
                            <LinkOutlined className="mr-2" /> Bạn bè
                        </a>
                    </motion.li>
                </motion.ul>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="border-t border-gray-200 my-6"
            />
            {showlistfriend ? (<motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <ListFriend listfriend={friends} />
            </motion.div>) : (<motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <PostList allpost={allpost} />
            </motion.div>)}




        </div>
    );
};

export default Account;