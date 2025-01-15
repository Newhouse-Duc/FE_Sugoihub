import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import CreatePost from '../../components/modals/CreatePost';
import { Skeleton, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { allPost } from '../../redux/Post/Post.thunk';
import PostList from '../../components/Post/PostList';
import { motion } from 'framer-motion';
import Giphy from '../../components/giphy/Giphy';


const Home = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const [createpost, setCreatePost] = useState(false)
    const dispatch = useDispatch()
    const userinfor = useSelector((state) => state.auth.userinfor);
    const allpost = useSelector((state) => state.post.allpost);

    useEffect(() => {
        if (userinfor?._id) {
            dispatch(allPost({ userId: userinfor._id }));
        }
    }, [userinfor, dispatch]);










    return (
        <div className="w-full max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-4">
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">


                <motion.div

                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >



                    <div className="flex items-start space-x-2 md:space-x-4">
                        {/* Avatar người dùng */}
                        <div className="flex-shrink-0">
                            <div className="relative w-10 h-10 md:w-12 md:h-12">
                                <img
                                    src={userinfor?.avatar?.url}
                                    className="rounded-full w-full h-full object-cover ring-2 ring-blue-500 ring-offset-2"
                                    alt="User avatar"
                                />
                            </div>
                        </div>

                        {/* Phần nhập nội dung */}
                        <div className="flex-1">
                            <div
                                onClick={() => setCreatePost(true)}
                                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 cursor-pointer transition duration-200"
                            >
                                Bạn đang nghĩ gì?
                            </div>
                        </div>
                        <button onClick={() => dispatch(openModal('createPost'))} className="px-6 py-2.5 bg-[#00CDB8] hover:bg-[#00b5a2] text-white rounded-lg transition-colors duration-200 font-medium">
                            Đăng
                        </button>
                        <CreatePost isOpen={createpost} onClose={() => setCreatePost(false)} />
                    </div>
                </motion.div>
            </div>









            <div className="divider my-4 md:my-6"></div>
            <PostList allpost={allpost} />






        </div>
    );
};

export default Home;
