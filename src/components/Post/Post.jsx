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
            label: <div onClick={() => setHistoryModal(true)}><i class="bi bi-clock-history"></i> Lịch sử chỉnh sửa</div>,
        },

    ].filter(Boolean);
    const stopVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

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
                    <p className="text-gray-800 mb-4">{post.content}</p>
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
                        pagination={{ clickable: true }}


                    >
                        <div
                            slot="container-start"
                            className="parallax-bg "
                            data-swiper-parallax="-23%"

                        ></div>
                        {post?.images?.map((image, index) => (
                            <SwiperSlide key={`image-${index}`}>
                                <div className="title w-auto h-auto mx-auto " data-swiper-parallax="-300">
                                    <img
                                        src={image.url}
                                        alt={`Slide ${index}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            margin: '0 auto',
                                            borderRadius: '8px',


                                        }}
                                        className="object-cover aspect-square"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                        {post?.videos?.map((video, index) => (
                            <SwiperSlide key={`video-${index}`}>
                                <div className="title w-auto h-auto mx-auto" data-swiper-parallax="-300">
                                    <video
                                        ref={videoRef}

                                        style={{
                                            width: '100%',

                                            height: '100%',

                                        }}
                                        className=" aspect-square"
                                    >
                                        <source src={video.url} type="video/mp4" />

                                    </video>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>




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
                <HistoryEditPost open={historymodal} onClose={() => setHistoryModal(false)} post={post} />

            </div >

        </>
    );
};

export default Post;
