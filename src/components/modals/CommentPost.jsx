import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar } from 'antd';
import { SmileOutlined, CameraOutlined, SendOutlined } from '@ant-design/icons';
import { newCommentPost } from '../../redux/Comment/Comment.thunk';
import InputEmoji from "react-input-emoji";
import { useSocket } from '../../socket/SocketContext';

const CommentPost = ({ isOpen, onClose, post }) => {

    const { socket } = useSocket();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [fileList, setFileList] = useState([]);
    const userinfor = useSelector((state) => state.auth.userinfor)
    const handleClickUpload = () => {
        setShowUpload(!showUpload);
    };
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
            className="comment-modal z-[1001] fixed inset-0 m-auto max-h-[90vh] px-4  pt-8 sm:pt-5  overflow-auto"
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
                <p className="text-gray-800 mb-4">{post?.content || "Không có nội dung."}</p>
                {post?.images?.length > 0 && (
                    <div className="grid gap-4">
                        {/* Trường hợp 1 ảnh */}
                        {post.images.length === 1 && (
                            <div className="flex justify-center">
                                <Image
                                    getContainer={false}
                                    src={post.images[0].url}
                                    alt="Post content"
                                    className="aspect-square w-64 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Trường hợp 2 ảnh */}
                        {post.images.length === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                {post.images.map((image) => (
                                    <Image
                                        getContainer={false}
                                        key={image._id}
                                        src={image.url}
                                        alt="Post content"
                                        className="aspect-square w-full object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}


                        {post.images.length === 3 && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <Image
                                        getContainer={false}
                                        src={post.images[0].url}
                                        alt="Post content"
                                        className="aspect-square w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-rows-2 gap-4">
                                    {post.images.slice(1).map((image) => (
                                        <Image
                                            getContainer={false}
                                            key={image._id}
                                            src={image.url}
                                            alt="Post content"
                                            className="aspect-square w-full object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Comment Input Section */}
            <div className="mt-6">
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
                <div className="mt-4 flex items-center gap-4">
                    <InputEmoji
                        value={text}
                        onChange={setText}
                        cleanOnEnter
                        onEnter={handleOnEnter}
                        placeholder="Viết bình luận..."
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="text-gray-500 hover:text-blue-500 transition"
                        onClick={handleClickUpload}
                    >
                        <i className="bi bi-camera text-xl" />
                    </button>
                </div>
            </div>

        </Modal>

    );
};

export default CommentPost;