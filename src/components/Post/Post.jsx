import React, { useEffect, useState } from 'react';
import { Image, message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import ActionPost from './ActionPost';
import { likePost } from '../../redux/Post/Post.thunk';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dropdown, Modal, Button, Skeleton, Card } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import EditPost from '../modals/EditPost';
import { deletePost } from '../../redux/Post/Post.thunk';

const Post = ({ post, onCommentClick, onViewPostClick }) => {
    const [modalDelete, setModalDelete] = useState(false);
    const dispatch = useDispatch()
    const [editModal, setEditModal] = useState(false)

    const userinfor = useSelector((state) => state.auth.userinfor)
    if (!post || !post.user) {
        return <p className="text-gray-500 text-center">Bài viết này không hợp lệ.</p>;
    }

    const formatDate = (date) => {
        return formatDistance(new Date(date), new Date(), {
            addSuffix: true,
            locale: vi
        });
    };

    const handleSubmitDelete = async (post) => {
        console.log("xem giá trị thửhahaha: ", post)
        const res = await dispatch(deletePost({ id: post._id })).unwrap();
        if (res.success) {
            message.success("Đã xóa bài viết thành công.");
        }
        setModalDelete(false);
    }
    const menuItems = [
        userinfor._id === post.user._id && {
            key: '1',
            label: <div onClick={() => setEditModal(true)}><i className="bi bi-pencil-square"></i> Sửa bài viết</div>,
        },
        userinfor._id === post.user._id && {
            key: '2',
            label: <div onClick={() => setModalDelete(true)}><i className="bi bi-trash"></i> Xóa bài viết</div>,
        },
        {
            key: '3',
            label: <div><i className="bi bi-exclamation-octagon"></i> Báo cáo bài viết</div>,
        },
        {
            key: '4',
            label: <div><i className="bi bi-share"></i> Chia sẻ bài viết</div>,
        },
        {
            key: '5',
            label: <div><i className="bi bi-bookmark"></i> Lưu bài viết</div>,
        },
        {
            key: '6',
            label: <div><i className="bi bi-eye-slash"></i> Ẩn bài viết</div>,
        }
    ].filter(Boolean);

    return (
        <>


            <div key={post._id} className="w-full p-5 mb-4 border border-gray-300 rounded-lg shadow-xl bg-white">
                {/* Header */}

                <div className="flex items-center justify-between mb-4 cursor-pointer " >
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                            <img
                                src={post.user.avatar?.url || "https://via.placeholder.com/150"}
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <a className=" hover:underline  hover:border-primary transition">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {post?.user?.username}
                                </h3>
                            </a>



                            <div className="flex items-center text-sm text-gray-500">
                                <p>   {formatDate(post.createdAt)}</p>
                                <span className="ml-2">
                                    {post.visibility === "public" && (
                                        <i className="bi bi-globe-asia-australia text-black-500" title="Public"></i>
                                    )}
                                    {post.visibility === "friends" && (
                                        <i className="bi bi-people-fill text-black-500" title="Friend"></i>
                                    )}
                                    {post.visibility === "private" && (
                                        <i className="bi bi-lock-fill text-black-500" title="Private"></i>
                                    )}
                                </span>
                            </div>
                        </div>

                    </div>
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <EllipsisOutlined className="text-xl hover:bg-gray-100 p-2 rounded-full" />
                    </Dropdown>

                </div>



                {/* Content */}
                <div className="mb-4 cursor-pointer" onClick={() => onViewPostClick(post)}>
                    <p className="text-gray-800 mb-4">{post.content || "Không có nội dung."}</p>
                    {post.images?.length > 0 && (
                        <div className="grid gap-4">
                            {/* Trường hợp 1 ảnh */}
                            {post.images.length === 1 && (
                                <div className="flex justify-center">


                                    <img

                                        getContainer={false}
                                        src={post.images[0].url}
                                        className="aspect-square w-64 object-cover rounded-lg" />
                                </div>
                            )}

                            {/* Trường hợp 2 ảnh */}
                            {post.images.length === 2 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {post.images.map((image) => (

                                        <img
                                            key={image.publicId}
                                            getContainer={false}
                                            src={image.url}
                                            className="aspect-square w-full object-cover rounded-lg" />
                                    ))}
                                </div>
                            )}


                            {post.images.length === 3 && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">

                                        <img
                                            key={post.images[0].publicId}
                                            getContainer={false}
                                            src={post.images[0].url}
                                            className="aspect-square w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div className="grid grid-rows-2 gap-4">
                                        {post.images.slice(1).map((image) => (
                                            <img
                                                key={image.publicId}
                                                getContainer={false}
                                                src={image.url}
                                                className="aspect-square w-full object-cover rounded-lg" />

                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}



                </div>

                <div className='divider'></div>
                <ActionPost post={post} onCommentClick={onCommentClick} />
                <Modal
                    title={<div className="text-lg font-semibold text-center">Xóa bài viết?</div>}
                    centered
                    open={modalDelete}
                    maskClosable
                    footer={
                        <div className="flex justify-center space-x-4">
                            <Button
                                key="cancel"
                                onClick={() => setModalDelete(false)}
                                className="hover:bg-gray-100"
                            >
                                Hủy
                            </Button>
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                onClick={() => handleSubmitDelete(post)}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    }
                >
                    <div className="text-center text-gray-600">
                        Nếu xóa bài viết này, bạn sẽ không khôi phục được nữa.
                    </div>
                </Modal>
                <EditPost open={editModal} onClose={() => setEditModal(false)} post={post} />

            </div >

        </>
    );
};

export default Post;
