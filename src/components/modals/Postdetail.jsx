import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar, Carousel } from 'antd';
import { allCommentByPost, likeComment } from '../../redux/Comment/Comment.thunk';


import { formatDistance } from 'date-fns';
import { getReplyComment } from '../../redux/Comment/Comment.thunk';

import { vi } from 'date-fns/locale';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import LazyNestedComments from '../NestedComments/LazyNestedComments';

const Postdetail = ({ isOpen, onClose, post }) => {

    const dispatch = useDispatch()


    const replyComment = useSelector((state) => state.comment.replyComment)


    const comment = useSelector((state) => state.comment.comment)
    const formatDate = (date) => {
        return formatDistance(new Date(date), new Date(), {
            addSuffix: true,
            locale: vi
        });
    };
    useEffect(() => {
        console.log("xem post đc gì ", post)
        if (post) {
            dispatch(allCommentByPost({ id: post._id }))
        }

    }, [post])





    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-lg font-semibold">Chi tiết bài đăng</span>
                    </div>
                }
                centered
                getContainer={false}
                open={isOpen}
                closeIcon={() => onClose()}
                onCancel={() => onClose()}
                width={800}
                className="viewpost-modal fixed inset-0 m-auto px-4 max-h-[90vh] !mt-[10vh]"
                footer={null}
            >
                <div className='max-h-[calc(80vh-80px)] overflow-auto'>
                    {/* Header Section */}
                    <div className="flex gap-4 mt-4 items-start">
                        <Avatar
                            src={post?.user?.avatar?.url}
                            size={50}
                            className="flex-shrink-0 shadow"
                        />
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">{post?.user?.username || "Người dùng ẩn danh"}</h3>
                            <div className="flex items-center text-sm text-gray-500 gap-3">
                                <p>Ngày đăng: {new Date(post?.createdAt).toLocaleString()} </p>
                                {post?.visibility === "public" && (
                                    <i className="bi bi-globe-asia-australia text-gray-500" title="Công khai"></i>
                                )}
                                {post?.visibility === "friends" && (
                                    <i className="bi bi-people-fill text-gray-500" title="Bạn bè "></i>
                                )}
                                {post?.visibility === "private" && (
                                    <i className="bi bi-lock-fill text-gray-500" title="Riêng tư "></i>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-4">
                        {/* Nội dung bài viết */}
                        <p className="text-gray-800 mb-4">{post?.content || "Không có nội dung."}</p>

                        {/* Carousel hiển thị ảnh nếu có */}
                        {post?.images?.length > 0 && (
                            <Carousel dots className="rounded-lg overflow-hidden">
                                {post.images.map((image, index) => (
                                    <div key={index} className="h-64 md:h-96">
                                        <img
                                            src={image.url}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        )}
                    </div>




                    <div className="divider "></div>
                    {/* Comment Input Section */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Tương tác của bài viết

                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Cột 1: Danh sách người thích */}
                        <div className="flex-1">
                            <div className="font-semibold text-lg mb-4">Danh sách người thích bài viết</div>
                            {post?.likedUsers && post.likedUsers.length > 0 ? (
                                <div className="space-y-4">
                                    {post.likedUsers.map((user) => (
                                        <div key={user._id} className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-blue-500 mx-1">
                                                    <img
                                                        src={user.avatar?.url}
                                                        alt={user.username}
                                                        className="w-full h-full rounded-full object-cover "
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">{user.username}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">Chưa có ai thích bài viết</div>
                            )}
                        </div>

                        {/* Cột 2: Danh sách người bình luận */}
                        <div className="flex-1">
                            <div className="font-semibold text-lg mb-4">Danh sách người bình luận bài viết</div>
                            {comment?.length > 0 ? (
                                <div className="space-y-4">
                                    {comment.map((commentItem, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-green-500 mx-1">
                                                    <img
                                                        src={commentItem.author?.avatar?.url}
                                                        alt={commentItem.author?.username}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {commentItem?.author?.username}
                                                </div>
                                                <div className="text-sm text-gray-600">{commentItem?.content}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">Chưa có bình luận nào</div>
                            )}
                        </div>
                    </div>


                    <div className="mt-4">
                        <div className="divider "></div>

                    </div>

                </div>

            </Modal>



        </>
    )
}

export default Postdetail