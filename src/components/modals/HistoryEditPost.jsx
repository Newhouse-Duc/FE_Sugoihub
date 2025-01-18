import React, { useEffect } from 'react'
import { Modal, Button, Image, Avatar } from 'antd'
import { historyPost } from '../../redux/Post/Post.thunk'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Parallax, FreeMode, EffectFade } from 'swiper/modules';
const HistoryEditPost = ({ open, onClose, post }) => {

    const dispatch = useDispatch()
    const historypost = useSelector((state) => state.post.historypost)
    const handleClose = () => {
        onClose()
    }

    useEffect(() => {
        if (open && post?._id) {
            dispatch(historyPost({ id: post._id }));
        }
    }, [open, post?._id, dispatch]);
    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-lg font-semibold">Lịch sử chỉnh sửa bài viết</span>
                    </div>
                }

                open={open}
                onCancel={() => onClose()}
                getContainer={() => document.body}
                centered
                closeIcon={null}
                width={600}
                className="profile-modal"
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleClose}
                        className="hover:bg-gray-100"
                    >
                        Đóng
                    </Button>,

                ]}
            >
                <div className='max-h-[calc(80vh-80px)] overflow-auto'>
                    {historypost.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 bg-gray-100 rounded-lg">
                            <i className="bi bi-clock-history text-2xl mb-2"></i>
                            <p>Lịch sử chỉnh sửa bài viết đã bị xóa hoặc không có.</p>
                        </div>
                    ) : (
                        historypost.map((post) => (

                            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                                <p className="text-blue-600 font-semibold text-sm">
                                    Thời gian sửa: {new Date(post?.createdAt).toLocaleString()}
                                </p>
                                {/* Phần thông tin người dùng */}
                                <div className="flex gap-4 items-start">
                                    <Avatar
                                        src={post?.user?.avatar?.url}
                                        size={50}
                                        className="flex-shrink-0 shadow"
                                    />
                                    <div className="flex-1 mt-2">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {post?.user?.username}
                                        </h3>

                                    </div>
                                </div>

                                {/* Phần nội dung bài viết */}
                                <div className="mt-4">
                                    <p className="text-gray-800 mb-4">{post?.content}</p>

                                    {/* Phần hình ảnh và video */}
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
                                        {post?.images?.map((image, index) => (
                                            <SwiperSlide key={`image-${index}`}>
                                                <div className="w-full h-64 flex justify-center items-center">
                                                    <img
                                                        src={image.url}
                                                        alt={`Slide ${index}`}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                        {post?.videos?.map((video, index) => (
                                            <SwiperSlide key={`video-${index}`}>
                                                <div className="w-full h-64 flex justify-center items-center">
                                                    <video
                                                        controls
                                                        className="w-full h-full object-cover rounded-lg"
                                                    >
                                                        <source src={video.url} type="video/mp4" />
                                                    </video>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </Modal>



        </>
    )
}

export default HistoryEditPost