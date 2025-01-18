import React, { useEffect, useState, useRef } from 'react';
import { Image, message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import ActionPost from './ActionPost';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Parallax, FreeMode, EffectFade } from 'swiper/modules';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dropdown, Modal, Button, Skeleton, Card } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import EditPost from '../modals/EditPost';
import { deletePost } from '../../redux/Post/Post.thunk';
import { removePostById } from '../../redux/Post/Post.slice';
import HistoryEditPost from '../modals/HistoryEditPost';

const Post = ({ post, onCommentClick, onViewPostClick }) => {
    const [modalDelete, setModalDelete] = useState(false);
    const dispatch = useDispatch()
    const videoRef = useRef(null);
    const [editModal, setEditModal] = useState(false)
    const [historymodal, setHistoryModal] = useState(false)
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

        const res = await dispatch(deletePost({ id: post._id })).unwrap();
        if (res.success) {
            message.success("Đã xóa bài viết thành công.");
            dispatch(removePostById(post))
        }
        setModalDelete(false);
    }

    const isEdited = post.createdAt !== post.updatedAt && new Date(post.updatedAt) > new Date(post.createdAt);
    const menuItems = [
        userinfor._id === post.user._id && {
            key: '1',
            label: <div onClick={() => setEditModal(true)}><i className="bi bi-pencil-square"></i> Sửa bài viết</div>,
        },
        userinfor._id === post.user._id && {
            key: '2',
            label: <div onClick={() => setModalDelete(true)}><i className="bi bi-trash"></i> Xóa bài viết</div>,
        },

        isEdited && {
            key: '3',
            label: (
                <div onClick={() => setHistoryModal(true)}>
                    <i className="bi bi-clock-history"></i> Lịch sử chỉnh sửa
                </div>
            ),
        }

    ].filter(Boolean);
    const stopVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <>


            <div key={post._id} className="w-full bg-white rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl mb-8 overflow-hidden">
                {/* Header Section - Refined */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={post.user.avatar?.url || "https://avatar.iran.liara.run/public/4"}
                                    alt="User avatar"
                                    className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-200 shadow-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                                    {post?.user?.username}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>{formatDate(post.createdAt)}</span>
                                    <span>•</span>
                                    <span>
                                        {post.visibility === "public" && (
                                            <i className="bi bi-globe-asia-australia text-blue-600" title="Public"></i>
                                        )}
                                        {post.visibility === "friends" && (
                                            <i className="bi bi-people-fill text-green-600" title="Friends"></i>
                                        )}
                                        {post.visibility === "private" && (
                                            <i className="bi bi-lock-fill text-red-600" title="Private"></i>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Dropdown
                                menu={{ items: menuItems }}
                                trigger={['click']}
                                placement="bottomRight"
                            >
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <EllipsisOutlined className="text-xl text-gray-600" />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Content Section - Enhanced */}
                <div className="p-6" onClick={() => onViewPostClick(post)}>
                    <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-line">
                        {post.content}
                    </p>

                    {/* Media Carousel */}
                    <div className="rounded-xl overflow-hidden ">
                        <Swiper
                            modules={[Navigation, Pagination, Parallax, FreeMode, EffectFade]}
                            effect="slide"
                            speed={500}
                            freeMode={true}
                            spaceBetween={10}
                            slidesPerView={2}
                            centeredSlides={true}
                            initialSlide={0}
                            slideToClickedSlide={false}
                            pagination={{
                                clickable: true,
                                bulletActiveClass: 'bg-blue-500',
                                bulletClass: 'swiper-pagination-bullet bg-gray-300 opacity-70'
                            }}
                            className="rounded-xl"
                        >
                            <div slot="container-start" className="parallax-bg" data-swiper-parallax="-23%"></div>

                            {/* Images */}
                            {post?.images?.map((image, index) => (
                                <SwiperSlide key={`image-${index}`}>
                                    <div className="relative aspect-square">
                                        <img
                                            src={image.url}
                                            alt={`Slide ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg shadow-sm"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}

                            {/* Videos */}
                            {post?.videos?.map((video, index) => (
                                <SwiperSlide key={`video-${index}`}>
                                    <div className="relative aspect-square">
                                        <video
                                            ref={videoRef}
                                            className="w-full h-full object-cover rounded-lg shadow-sm"
                                            controls
                                        >
                                            <source src={video.url} type="video/mp4" />
                                        </video>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                </div>

                {/* Actions Section - Modernized */}
                <div className="px-6 pb-6">
                    <div className="h-px bg-gray-200 mb-4"></div>
                    <ActionPost post={post} onCommentClick={onCommentClick} />
                </div>

                <Modal
                    title={
                        <div className="text-xl font-semibold text-center text-gray-800 py-4">
                            Xác nhận xóa bài viết
                        </div>
                    }
                    centered
                    open={modalDelete}
                    maskClosable
                    footer={
                        <div className="flex justify-center space-x-4 px-6 pb-6">
                            <Button
                                onClick={() => setModalDelete(false)}
                                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                danger
                                onClick={() => handleSubmitDelete(post)}
                                className="px-6 py-2 rounded-lg"
                            >
                                Xác nhận
                            </Button>
                        </div>
                    }
                >
                    <div className="text-center text-gray-600 py-4">
                        Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn muốn xóa?
                    </div>
                </Modal>

                <EditPost open={editModal} onClose={() => setEditModal(false)} post={post} />
                <HistoryEditPost open={historymodal} onClose={() => setHistoryModal(false)} post={post} />
            </div>


        </>
    );
};

export default Post;
