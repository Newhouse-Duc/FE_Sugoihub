import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myPost } from "../../redux/Post/Post.thunk";
import PostList from "../../components/Post/PostList";

import Profile from "../../components/modals/Profile";
import { Avatar } from "antd";
import { UserOutlined, MailOutlined, LinkOutlined } from "@ant-design/icons";

const Account = () => {
    const dispatch = useDispatch();
    const userinfor = useSelector((state) => state.auth.userinfor);
    const allpost = useSelector((state) => state.post.allpost);
    const [modalprofile, setModalProfile] = useState(false)

    useEffect(() => {
        if (userinfor?._id) {
            dispatch(myPost({ userId: userinfor._id }));
        }
    }, [userinfor._id]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            {/* Box thông tin người dùng */}
            <div className="w-full p-6 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] hover:shadow-xl transition-shadow duration-300">
                <Profile isOpen={modalprofile} onClose={() => setModalProfile(false)} />

                {/* Phần avatar và tên người dùng */}
                <div className="flex flex-col items-center mb-6">
                    <div className="mb-4">
                        <Avatar
                            size={120}
                            src={userinfor?.avatar?.url}
                            icon={<UserOutlined />} // Hiển thị icon mặc định nếu không có avatar
                            alt="User Avatar"
                            className="border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">{userinfor?.username}</h2>
                    <p className="text-sm text-gray-600 flex items-center">
                        <MailOutlined className="mr-2" /> {userinfor?.email}
                    </p>
                </div>

                {/* Tiểu sử */}
                <div className="mt-6">
                    <h1 className="text-lg font-semibold text-gray-800 mb-3">Tiểu sử</h1>
                    <p className="text-sm text-gray-700 mb-4">{userinfor?.bio || "Chưa có tiểu sử."}</p>
                </div>

                {/* Line separator */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Các liên kết */}
                <ul className="flex justify-center md:justify-start gap-8">
                    <li>
                        <a
                            className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center"
                            href="#"
                        >
                            <LinkOutlined className="mr-2" /> Bài viết
                        </a>
                    </li>
                    <li>
                        <a
                            className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center"
                            href="#"
                        >
                            <LinkOutlined className="mr-2" /> Bạn bè
                        </a>
                    </li>
                    <li>
                        <a
                            className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center"
                            href="#"
                        >
                            <LinkOutlined className="mr-2" /> Giới thiệu
                        </a>
                    </li>
                </ul>
            </div>

            {/* Line separator */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Danh sách bài viết */}
            <PostList allpost={allpost} />
        </div>
    );
};

export default Account;