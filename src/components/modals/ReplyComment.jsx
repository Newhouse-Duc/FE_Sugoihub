import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar } from 'antd';
import { SmileOutlined, CameraOutlined, SendOutlined } from '@ant-design/icons';
import { replyComment } from '../../redux/Comment/Comment.thunk';
import InputEmoji from "react-input-emoji";
import { useSocket } from '../../socket/SocketContext';
import Giphy from '../giphy/Giphy';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ReplyComment = ({ isOpen, onClose, comment }) => {

    const { socket } = useSocket()
    const dispatch = useDispatch();
    const userinfor = useSelector((state) => state.auth.userinfor)
    const [commentorg, setCommentorg] = useState(null)
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [text, setText] = useState("");
    const [showgif, setShowGif] = useState(false)
    const [selectedGif, setSelectedGif] = useState(null);
    const handleGifSelect = (gif) => {
        setSelectedGif(gif);
    };
    const handleClickUpload = () => {
        setShowUpload(!showUpload);
        setShowGif(false)
    };
    const handleShowGif = () => {
        setShowGif(!showgif)
    }

    const handleChangeUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    useEffect(() => {
        if (comment) {
            setCommentorg(comment)
            console.log("xem comment nhận được: ", commentorg)
        }
    }, [comment])
    useEffect(() => {
        if (comment) {
            setCommentorg(comment)
            console.log("xem comment nhận được: ", commentorg)
        }
    })
    const handleSubmit = async () => {
        if (!text.trim() && fileList.length === 0) {
            message.warning('Vui lòng nhập nội dung hoặc thêm ảnh')
            return
        }
        try {
            setLoading(true)

            const data = new FormData();
            data.append("content", text);
            data.append("author", userinfor._id);
            data.append("parentId", comment._id);
            data.append("postId", comment.postId);
            if (selectedGif) {
                const gifData = {
                    url: selectedGif.url,
                    id: selectedGif.id
                };
                data.append("gif", JSON.stringify(gifData));
            }
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("images", file.originFileObj);
                }
            });
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }
            const res = await dispatch(replyComment({ data })).unwrap()
            if (res.success && comment.author._id !== userinfor._id) {

                const replycomment = {
                    recipient: comment.author._id,
                    entityId: comment._id,
                    sender: userinfor._id,
                    entityType: 'COMMENT',
                    type: "COMMENT_REPLY",
                    text: "đã phản hồi bình luận của bạn"
                };
                socket.emit("replycomment", replycomment);

                message.success('Đăng bình luận thành công');
                setText("")
                setFileList([]);
                setSelectedGif(null);
                setShowGif(false);
                onClose();
            }
        } catch (error) {
            console.error("Error posting comment:", error)
            message.error('Có lỗi xảy ra khi đăng bình luận')
        } finally {
            setLoading(false)
        }
    }
    const handleCloseModal = () => {
        setCommentorg(null);
        onClose();
    };
    return (
        <>

            <Modal
                title={
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                        <span className="text-xl font-bold text-gray-700">Phản hồi bình luận</span>
                    </div>
                }

                getContainer={() => document.body}
                open={isOpen}
                onCancel={onClose}
                maskClosable={false}
                closeIcon={null}
                width={600}
                className="comment-modal  fixed inset-0 m-auto max-h-[90vh] px-4  pt-8 sm:pt-5  overflow-auto  !mt-[10vh]"

                footer={
                    <div className="flex justify-end">
                        <Button
                            key="cancel"
                            onClick={handleCloseModal}
                            className="hover:bg-gray-100 rounded-md px-4 py-2 text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Hủy
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleSubmit}
                            loading={loading}
                            icon={<SendOutlined />}
                            disabled={!text.trim() && fileList.length === 0}
                            className="rounded-md px-4 py-2 ml-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Đăng
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200  ">
                    {/* Comment Section */}
                    <div key={commentorg?._id} className="flex space-x-4 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 border-b-2">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-offset-2 ring-blue-500">
                                <img
                                    src={commentorg?.author.avatar.url}
                                    alt="ảnh đại diện"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <p className="font-semibold text-gray-900">{commentorg?.author?.username}</p>
                                <span className="text-sm text-gray-500"> {commentorg?.createdAt}</span>
                            </div>

                            <p className="mt-2 text-gray-700">{commentorg?.content}</p>

                            {/* Images Grid */}
                            {commentorg?.images && commentorg?.images.length > 0 && (
                                <div className="mt-3 grid gap-2 grid-cols-2">
                                    {commentorg.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`Comment attachment ${index + 1}`}
                                            className="rounded-lg object-cover w-full h-32"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            )}
                            {commentorg?.gif && (<img
                                key={commentorg.gif.id}
                                src={commentorg.gif.url}

                                className="max-w-full  h-28 "
                            />)}
                        </div>
                    </div>




                    {/* Reply Section */}
                    <div className="mt-2">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={userinfor.avatar.url}
                                size={40}
                                className="flex-shrink-0 ring-2 ring-offset-2 ring-blue-500"
                            />
                            <h1 className="text-lg font-semibold text-gray-800">{userinfor.username}</h1>
                        </div>

                        {/* Upload Section */}
                        {showUpload && (
                            <div className="mt-4">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChangeUpload}
                                    maxCount={3}
                                    multiple
                                    beforeUpload={() => false}
                                >
                                    {fileList.length < 3 && (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <CameraOutlined className="text-2xl text-blue-500" />
                                            <span className="text-sm text-gray-600 mt-2">Tải ảnh lên</span>
                                        </div>
                                    )}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>
                        )}

                        {/* Comment Input */}
                        <div className="mt-4  items-center gap-4  flex-1 relative max-w-[600px]  ">
                            <div className=" items-center gap-2  rounded-lg p-2 ">


                                {showgif && (
                                    <div className="relative bottom-full mb-2 w-full ">
                                        <Giphy onGifSelect={handleGifSelect} />
                                    </div>
                                )}

                                <div className="flex-1 relative max-w-[600px] ">
                                    <div className="max-h-[100px]">
                                        <InputEmoji
                                            value={text}
                                            onChange={setText}
                                            cleanOnEnter
                                            placeholder={`Trả lời bình luận của ${commentorg?.author?.username}`}
                                        />
                                        <div className="flex gap-2 ml-4">
                                            <Button onClick={handleClickUpload} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                                📸
                                            </Button>
                                            <Button onClick={handleShowGif} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                                🕹️
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>



                    </div>
                </div>

            </Modal>

        </>
    )
}

export default ReplyComment