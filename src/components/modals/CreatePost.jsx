import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Button, Modal, message, Select, Upload, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalOutlined, TeamOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { newPost } from '../../redux/Post/Post.thunk';
import { useSocket } from '../../socket/SocketContext';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const MemoizedEmojiPicker = React.memo(EmojiPicker);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const CreatePost = ({ isOpen, onClose }) => {
    const { socket } = useSocket();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiClick = (emoji) => {
        setPostContent((prev) => prev + emoji.emoji);
    };
    const dispatch = useDispatch();
    const userinfor = useSelector((state) => state.auth.userinfor);

    const [postContent, setPostContent] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [showuploadedImages, setShowUploadedImages] = useState(false);
    const [showuploadedVideo, setShowUploadedVideo] = useState(false);
    const [fileList, setFileList] = useState([]);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChangeUpload = ({ fileList: newFileList }) => {

        setFileList(newFileList);
    };
    const uploadButton = (
        <button type="button">
            <PlusOutlined />
            <div className='my-2'>Thêm ảnh </div>
        </button>

    );
    const [isUploading, setIsUploading] = useState(false);
    const handleCreatePost = async () => {


        try {
            setIsUploading(true);

            if (!postContent.trim()) {
                message.warning("Nội dung bài viết không được để trống");
                return;
            }


            const data = new FormData();
            data.append("content", postContent);
            data.append("visibility", visibility);
            data.append("userId", userinfor._id);


            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("images", file.originFileObj);
                }
            });
            fileListvideo.forEach((file) => {
                if (file.originFileObj) {
                    console.log("Appending video file:", file.originFileObj);
                    data.append("videos", file.originFileObj);
                }
            });

            const res = await dispatch(newPost({ data })).unwrap();

            if (res.success) {
                message.success("Tạo bài viết thành công");
                onClose();
                setPostContent('');
                setVisibility('public');
                setFileList([]);
                setFileListVideo([]);
                const newpost = {
                    postId: res.post._id,
                    authorId: userinfor._id
                }
                socket.emit("newpost", newpost);
            }



        } catch (error) {
            message.error("Lỗi: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };


    const [fileListvideo, setFileListVideo] = useState([]);

    const handleChangeVideo = ({ fileList: newFileListVideo }) => {
        const isLtMaxSize = newFileListVideo.every(file => {
            if (file.originFileObj) {
                return file.originFileObj.size / 1024 / 1024 < 20; // Giới hạn 20MB
            }
            return true;
        });

        if (!isLtMaxSize) {
            message.error('Video phải nhỏ hơn 20MB!');
            return;
        }
        const updatedList = newFileListVideo.map((file) => {
            if (!file.originFileObj) return file;


            const isValidFormat = ['video/mp4', 'video/quicktime'].includes(file.originFileObj.type);
            if (!isValidFormat) {
                message.error('Chỉ chấp nhận file MP4 hoặc MOV!');
                return null;
            }

            if (!file.url && !file.preview) {
                file.preview = URL.createObjectURL(file.originFileObj);
            }
            return file;
        }).filter(Boolean);
        setFileListVideo(updatedList);
    };
    const beforeUpload = (file) => {
        const isVideo = file.type === 'video/mp4' || file.type === 'video/quicktime';
        if (!isVideo) {
            message.error('Chỉ chấp nhận file MP4 hoặc MOV!');
        }
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('Video phải nhỏ hơn 20MB!');
        }
        return false; // return false để không tự động upload
    };
    useEffect(() => {
        return () => {

            fileListvideo.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [fileListvideo]);
    const [isCancelConfirmVisible, setCancelConfirmVisible] = useState(false);

    const handleCancelPost = () => {
        setCancelConfirmVisible(true);
    };

    const confirmCancel = () => {
        setCancelConfirmVisible(false);
        setPostContent('');
        setVisibility('public');
        setFileList([]);
        setFileListVideo([]);
        onClose()
        console.log('Đã hủy bài đăng');
    };

    const closeConfirmModal = () => {
        setCancelConfirmVisible(false);

    };

    return (
        <>
            <Modal
                title="Bài đăng mới"
                centered

                closeIcon={false}
                open={isOpen}
                getContainer={() => document.body}
                onCancel={() => onClose()}
                maskClosable={false}
                footer={[
                    <div key="footer-container" className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        <Button
                            key="cancel"
                            onClick={handleCancelPost}
                            className="w-full md:w-auto bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition duration-200 shadow"
                        >
                            Hủy
                        </Button>

                        <Button
                            key="submit"
                            onClick={handleCreatePost}
                            loading={isUploading}
                            icon={<i className="bi bi-send text-lg mr-2"></i>}
                            className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition duration-200 shadow"
                        >
                            Đăng
                        </Button>
                    </div>
                ]}

            >
                {/* Header: Avatar và tên người dùng */}
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12">
                        <img
                            src={userinfor.avatar?.url}
                            className="rounded-full w-full h-full object-cover ring-2 ring-blue-500"
                            alt="User avatar"
                        />
                    </div>
                    <div className="ml-3">
                        <div className="font-semibold text-lg">{userinfor.username}</div>
                        <Select
                            defaultValue="public"
                            value={visibility}
                            onChange={(value) => setVisibility(value)}
                            options={[
                                {
                                    label: (
                                        <div className="flex items-center">
                                            <GlobalOutlined className="mr-2" />
                                            Công khai
                                        </div>
                                    ),
                                    value: 'public',
                                },
                                {
                                    label: (
                                        <div className="flex items-center">
                                            <TeamOutlined className="mr-2" />
                                            Bạn bè
                                        </div>
                                    ),
                                    value: 'friends',
                                },
                                {
                                    label: (
                                        <div className="flex items-center">
                                            <LockOutlined className="mr-2" />
                                            Riêng tư
                                        </div>
                                    ),
                                    value: 'private',
                                },
                            ]}
                            style={{ width: 130 }}
                        />
                    </div>
                </div>

                {/* Textarea: Viết nội dung */}
                <textarea
                    placeholder="Bạn đang nghĩ gì?"
                    className="w-full h-32 p-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 resize-none"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                ></textarea>

                {/* Emoji và Media Buttons */}
                <div className="flex space-x-4 mt-4">
                    <Button onClick={() => setShowEmojiPicker((prev) => !prev)}>😀 Emoji</Button>
                    <Button onClick={() => setShowUploadedImages((prev) => !prev)}>🖼️ Ảnh</Button>
                    <Button onClick={() => setShowUploadedVideo((prev) => !prev)}>🎥 Video</Button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="mt-2">
                        <Suspense fallback={<div>Loading Emoji Picker...</div>}>
                            <MemoizedEmojiPicker onEmojiClick={handleEmojiClick} />
                        </Suspense>
                    </div>
                )}

                {/* Image Upload */}
                {showuploadedImages && (
                    <div className="mt-4">
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChangeUpload}
                            maxCount={3}
                            multiple
                        >
                            {fileList.length >= 3 ? null : uploadButton}
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

                {/* Video Upload */}
                {showuploadedVideo && (
                    <div className="mt-4">
                        <Upload
                            accept="video/*"
                            fileList={fileListvideo}
                            beforeUpload={beforeUpload}
                            onChange={handleChangeVideo}
                            maxCount={1}
                            progress={{
                                strokeColor: {
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                },
                                strokeWidth: 3,
                                format: percent => `${parseFloat(percent.toFixed(2))}%`
                            }}
                        >
                            <Button disabled={fileListvideo.length >= 1}>Upload Video</Button>
                        </Upload>
                        {fileListvideo.length > 0 && fileListvideo[0].preview && (
                            <div className="mt-4">
                                <video controls width="100%" src={fileListvideo[0].preview}></video>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
            <Modal
                title="Xác nhận hủy bài đăng"
                centered
                open={isCancelConfirmVisible}
                onCancel={closeConfirmModal}
                footer={[
                    <Button key="no" onClick={closeConfirmModal}>
                        Không
                    </Button>,
                    <Button key="yes" type="primary" danger onClick={confirmCancel}>
                        Có
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy bài đăng này không?</p>
            </Modal>

        </>
    );
};

export default CreatePost;
