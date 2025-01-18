import { useDispatch, useSelector } from 'react-redux'
import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Button, Modal, message, Select, Upload, Image } from 'antd';
import { GlobalOutlined, TeamOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { updatePost } from '../../redux/Post/Post.thunk';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const MemoizedEmojiPicker = React.memo(EmojiPicker);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const EditPost = ({ open, onClose, post }) => {


    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiClick = (emoji) => {
        setPostContent((prev) => prev + emoji.emoji);
    };
    const dispatch = useDispatch();
    const userinfor = useSelector((state) => state.auth.userinfor);


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [showuploadedImages, setShowUploadedImages] = useState(false);
    const [showuploadedVideo, setShowUploadedVideo] = useState(false);
    const [postContent, setPostContent] = useState(post.content);
    const [visibility, setVisibility] = useState(post.visibility || 'public');
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
    const handleEditPost = async () => {
        try {
            setIsUploading(true);

            if (!postContent.trim()) {
                message.warning("Nội dung bài viết không được để trống");
                setIsUploading(false);
                return;
            }

            const data = new FormData();
            data.append("content", postContent);
            data.append("visibility", visibility);
            data.append("userId", userinfor._id);


            console.log("xem full: ", imagesDelete)
            if (imagesDelete.length > 0) {
                data.append("imagesDelete", JSON.stringify(imagesDelete));
            }
            if (videosDelete.length > 0) {
                data.append("videosDelete", JSON.stringify(videosDelete));
            }
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


            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }


            const res = await dispatch(updatePost({ id: post._id, data: data })).unwrap();
            if (res.success) {
                message.success("Sửa bài viết thành công");
                onClose();

            }
        } catch (error) {
            message.error("Lỗi: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };



    const [fileListvideo, setFileListVideo] = useState([]);
    // useEffect(() => {
    //     if (post.videos && Array.isArray(post.videos)) {

    //         const updatedFileListvideo = post.videos.map(video => ({
    //             url: video.url,
    //             publicId: video.publicId,
    //         }));
    //         setFileListVideo(updatedFileListvideo)
    //     }
    //     if (post.images && Array.isArray(post.images)) {
    //         const updatedFileList = post.images.map(image => ({
    //             url: image.url,
    //             publicId: image.publicId,
    //         }));
    //         setFileList(updatedFileList);
    //     }
    // }, [post])
    useEffect(() => {
        if (post.videos && Array.isArray(post.videos)) {
            const updatedFileListvideo = post.videos.map(video => ({
                uid: video.publicId, // Thêm uid để xác định video
                url: video.url,
                publicId: video.publicId,
                name: video.url.split('/').pop(), // Tên file video
                status: 'done', // Đánh dấu là đã upload thành công
            }));
            setFileListVideo(updatedFileListvideo);
        }
        if (post.images && Array.isArray(post.images)) {
            const updatedFileList = post.images.map(image => ({
                uid: image.publicId,
                url: image.url,
                publicId: image.publicId,
                name: image.url.split('/').pop(),
                status: 'done',
            }));
            setFileList(updatedFileList);
        }
    }, [post]);
    // const handleChangeVideo = ({ fileList: newFileListVideo }) => {
    //     const isLtMaxSize = newFileListVideo.every(file => {
    //         if (file.originFileObj) {
    //             return file.originFileObj.size / 1024 / 1024 < 20;
    //         }
    //         return true;
    //     });

    //     if (!isLtMaxSize) {
    //         message.error('Video phải nhỏ hơn 20MB!');
    //         return;
    //     }
    //     const updatedList = newFileListVideo.map((file) => {
    //         if (!file.originFileObj) return file;


    //         const isValidFormat = ['video/mp4', 'video/quicktime'].includes(file.originFileObj.type);
    //         if (!isValidFormat) {
    //             message.error('Chỉ chấp nhận file MP4 hoặc MOV!');
    //             return null;
    //         }

    //         if (!file.url && !file.preview) {
    //             file.preview = URL.createObjectURL(file.originFileObj);
    //         }
    //         return file;
    //     }).filter(Boolean);
    //     setFileListVideo(updatedList);
    // };
    const handleChangeVideo = ({ fileList: newFileListVideo }) => {
        const isLtMaxSize = newFileListVideo.every(file => {
            if (file.originFileObj) {
                return file.originFileObj.size / 1024 / 1024 < 20;
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
        return false;
    };
    useEffect(() => {
        return () => {
            console.log("xem có video list không  ", fileListvideo)
            fileListvideo.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };

    }, [fileListvideo]);
    useEffect(() => {
        console.log("xem có video list không  ", fileListvideo)

    }, [fileListvideo]);
    const [isCancelConfirmVisible, setCancelConfirmVisible] = useState(false);


    const closeConfirmModal = () => {
        setCancelConfirmVisible(false);

    };
    const [imagesDelete, setImagesDelete] = useState([]);
    const handleDeleteImages = (file) => {

        setImagesDelete((prevImages) => {
            if (Array.isArray(prevImages)) {
                return [...prevImages, file.publicId];
            } else {
                return [file.publicId];
            }
        });


    };

    const [videosDelete, setVideosDelete] = useState([]);
    // const handleDeleteVideo = (file) => {

    //     setVideosDelete((prevVideos) => {
    //         if (Array.isArray(prevVideos)) {
    //             return [...prevVideos, file.publicId];
    //         } else {
    //             return [file.publicId];
    //         }
    //     });

    //     console.log("Danh sách file đã xóa: ", videosDelete);
    // };
    const handleDeleteVideo = (file) => {
        setVideosDelete((prevVideos) => {
            if (Array.isArray(prevVideos)) {
                return [...prevVideos, file.publicId];
            } else {
                return [file.publicId];
            }
        });

        const updatedFileList = fileListvideo.filter((item) => item.uid !== file.uid);
        setFileListVideo(updatedFileList);
    };
    return (
        <>
            <Modal
                title="Bài đăng mới"


                open={open}
                getContainer={() => document.body}
                maskClosable={false}
                footer={[
                    <Button
                        key="cancel"
                        onClick={onClose}
                        icon={<i className="bi bi-trash text-lg mr-2"></i>}
                        className="w-full md:w-auto bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-400 active:bg-slate-800 transition duration-200 shadow"
                    >
                        Hủy
                    </Button>,

                    <Button
                        onClick={handleEditPost}
                        loading={isUploading}
                        icon={<i className="bi bi-send text-lg mr-2"></i>}
                        className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition duration-200 shadow"
                    >
                        Đăng
                    </Button>

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
                {(showuploadedImages || (fileList && fileList.length > 0)) && (
                    <div className="mt-4">
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChangeUpload}
                            maxCount={3}
                            onRemove={(file) => handleDeleteImages(file)}
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

                {(showuploadedVideo || (fileListvideo && fileListvideo.length > 0)) && (
                    <div className="mt-4">
                        <Upload
                            accept="video/*"
                            fileList={fileListvideo}
                            beforeUpload={beforeUpload}
                            onChange={handleChangeVideo}
                            maxCount={2}
                            onRemove={(file) => handleDeleteVideo(file)}
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
                        {fileListvideo.map((file) => (
                            <div key={file.uid} className="mt-4">
                                <video controls width="100%" src={file.url || file.preview}></video>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
            <Modal
                title="Những thay đổi sẽ không được áp dụng bạn muốn hủy?"
                centered
                open={isCancelConfirmVisible}
                onCancel={closeConfirmModal}
                footer={[
                    <Button key="no" onClick={closeConfirmModal}>
                        Không
                    </Button>,
                    <Button key="yes" type="primary" danger onClick={onClose}>
                        Có
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy bài đăng này không?</p>
            </Modal>
        </>
    )
}

export default EditPost