import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar } from 'antd';
import { SmileOutlined, CameraOutlined, SendOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Parallax, FreeMode, EffectFade } from 'swiper/modules';
import { newCommentPost } from '../../redux/Comment/Comment.thunk';
import InputEmoji from "react-input-emoji";
import { useSocket } from '../../socket/SocketContext';
import Giphy from '../giphy/Giphy';

const CommentPost = ({ isOpen, onClose, post }) => {

    const { socket } = useSocket();
    const dispatch = useDispatch();
    const [showgif, setShowGif] = useState(false)
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [fileList, setFileList] = useState([]);
    const userinfor = useSelector((state) => state.auth.userinfor)
    const handleClickUpload = () => {
        setShowUpload(!showUpload);
        setShowGif(false)
    };
    const handleShowGif = () => {
        setShowGif(!showgif)
    }
    const [text, setText] = useState("");

    function handleOnEnter(text) {
        console.log("enter", text);
    }
    const handleChangeUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleSubmit = async () => {
        try {
            if (!text.trim() && fileList.length === 0) {
                message.warning('Vui lòng nhập bình luận hoặc thêm ảnh');
                return;
            }
            setLoading(true);
            const data = new FormData();
            data.append("content", text);
            data.append("author", userinfor._id);
            data.append("postId", post._id);

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("images", file.originFileObj);
                }
            });
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }


            const res = await dispatch(newCommentPost({ data })).unwrap()

            if (res.success) {

                const newcomment = {
                    recipient: post.user._id,
                    entityId: post._id,
                    sender: userinfor._id,
                    entityType: 'POST',
                    type: "POST_COMMENT",
                    text: "đã bình luận về bài viết của bạn"
                };
                socket.emit("commentpost", newcomment);

                message.success('Đăng bình luận thành công');


                setFileList([]);
                onClose();
                setText("")
            }


        } catch (error) {
            console.log("Xem lỗi nào : ", error)
            message.error('Có lỗi xảy ra khi đăng bình luận');
        } finally {
            setLoading(false);
        }
    };
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        if (isOpen) {

            setScrollPosition(window.scrollY);

            document.body.style.overflow = 'hidden';
        } else {

            document.body.style.overflow = 'auto';
            window.scrollTo(0, scrollPosition);
        }
    }, [isOpen, scrollPosition]);


    return (
        <Modal
            title={
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <span className="text-xl font-bold text-gray-700">Bình luận</span>
                </div>
            }
            centered
            getContainer={() => document.body}
            open={isOpen}
            onCancel={onClose}
            maskClosable={false}

            closeIcon={null}
            width={600}
            className="comment-modal z-[1001] fixed inset-0 m-auto max-h-[90vh] px-4  pt-8 sm:pt-5   overflow-auto "
            footer={[
                <Button
                    key="cancel"
                    onClick={onClose}
                    className="hover:bg-gray-100 rounded-md px-4 py-2 text-gray-600"
                >
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    icon={<SendOutlined />}
                    disabled={!text.trim() && fileList.length === 0}
                    className="rounded-md px-4 py-2"
                >
                    Đăng
                </Button>,
            ]}
        >
            <div>
                {/* Header Section */}
                <div className="flex gap-4 mt-4 items-start ">
                    <Avatar
                        src={post?.user?.avatar?.url}
                        size={50}
                        className="flex-shrink-0 shadow"
                    />
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">{post?.user?.username || "Người dùng ẩn danh"}</h3>
                        <div className="flex items-center text-sm text-gray-500 gap-3">
                            <p>{new Date(post?.createdAt).toLocaleString()}</p>
                            {post?.visibility === "public" && (
                                <i className="bi bi-globe-asia-australia text-gray-500" title="Public"></i>
                            )}
                            {post?.visibility === "friends" && (
                                <i className="bi bi-people-fill text-gray-500" title="Friend"></i>
                            )}
                            {post?.visibility === "private" && (
                                <i className="bi bi-lock-fill text-gray-500" title="Private"></i>
                            )}
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="mt-4">
                    <p className="text-gray-800 mb-4">{post?.content}</p>
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
                                    <Image
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
                                        controls
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

                {/* Comment Input Section */}
                <div className="mt-6 relative">
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={userinfor.avatar.url}
                            size={40}
                            className="flex-shrink-0"
                        />
                        <h1 className="text-lg font-semibold text-gray-800">{userinfor.username}</h1>
                    </div>

                    {/* Upload Section */}
                    {showUpload && (
                        <div className="mt-4">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleChangeUpload}
                                maxCount={3}
                                multiple
                                beforeUpload={() => false}
                            >
                                <div className="flex items-center gap-2 px-5 py-7 bg-gray-50 rounded-md shadow hover:bg-gray-100 cursor-pointer transition duration-200">
                                    <CameraOutlined className="text-lg text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Chọn ảnh</span>
                                </div>
                            </Upload>
                        </div>
                    )}

                    {/* Comment Input */}
                    <div className="mt-4  items-center gap-4  flex-1 relative max-w-[600px]  ">
                        <div className=" items-center gap-2 bg-gray-100 rounded-lg p-2 ">


                            {showgif && (
                                <div className="relative bottom-full mb-2 w-full ">
                                    <Giphy />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button onClick={handleClickUpload} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                    📸 <span>Ảnh</span>
                                </Button>
                                <Button onClick={handleShowGif} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                    🕹️ <span>GiF</span>
                                </Button>
                            </div>
                            <div className="flex-1 relative max-w-[600px] ">
                                <div className="max-h-[100px]">
                                    <InputEmoji
                                        value={text}
                                        onChange={setText}
                                        cleanOnEnter
                                        onEnter={handleOnEnter}
                                        placeholder="Viết bình luận..."
                                        height={40}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Modal>

    );
};

export default CommentPost;