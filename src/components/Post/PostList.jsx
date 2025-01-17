import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from './Post';
import CommentPost from '../modals/CommentPost';
import ViewPost from '../modals/ViewPost';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PostList = ({ allpost }) => {
    const dispatch = useDispatch();
    const [selectedPost, setSelectedPost] = useState(null);
    const [viewpost, setViewPost] = useState(null);
    const [modalviewpost, setModalViewPost] = useState(false);
    const [modalcommentpost, setModalCommentPost] = useState(false);
    const loadingpost = useSelector((state) => state.post.loadingpost);
    const validPosts = allpost?.filter((post) => post && post.user);




    const handleOpenComment = (post) => {
        setSelectedPost(post);
        setModalCommentPost(true);
    };

    const handleCloseComment = () => {
        setSelectedPost(null);
        setModalCommentPost(false);
    };

    const handleCloseViewPost = () => {
        setViewPost(null);
        setModalViewPost(false);
    };

    const handleOpenViewPost = (post) => {
        setViewPost(post);
        setModalViewPost(true);
    };



    return (
        <>
            <div className="relative">
                <div className="w-full justify-center my-2 bg-gray-100">
                    {loadingpost ? (
                        <div className="w-full p-5 mb-4 border border-gray-300 rounded-lg shadow-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="skeleton w-12 h-12 rounded-full shrink-0" />
                                    <div className="flex flex-col gap-2">
                                        <div className="skeleton h-4 w-32" />
                                        <div className="flex items-center gap-2">
                                            <div className="skeleton h-3 w-24" />
                                            <div className="skeleton w-4 h-4 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="skeleton w-8 h-8 rounded-full" />
                            </div>
                            <div className="mb-4">
                                <div className="space-y-2 mb-4">
                                    <div className="skeleton h-4 w-full" />
                                    <div className="skeleton h-4 w-3/4" />
                                </div>
                                <div className="grid gap-4">
                                    <div className="flex justify-center">
                                        <div className="skeleton aspect-square w-64 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="divider my-4" />
                            <div className="flex items-center space-x-4">
                                <div className="skeleton h-8 w-20" />
                                <div className="skeleton h-8 w-20" />
                                <div className="skeleton h-8 w-20" />
                            </div>
                        </div>
                    ) : validPosts?.length > 0 ? (
                        validPosts.map((post) => (
                            <Post
                                key={post._id}
                                post={post}
                                onCommentClick={handleOpenComment}
                                onViewPostClick={handleOpenViewPost}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Không có bài viết nào để hiển thị</p>
                    )}
                </div>

                <CommentPost
                    isOpen={modalcommentpost}
                    onClose={handleCloseComment}
                    post={selectedPost}
                    style={{ zIndex: 1001 }}
                />

                <ViewPost
                    isOpen={modalviewpost}
                    onClose={handleCloseViewPost}
                    post={viewpost}
                    onCommentClick={handleOpenComment}
                    style={{ zIndex: 1000 }}
                />
            </div>
        </>
    );
};

export default PostList;