import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useMemo } from 'react'
import { getAllPost, hidePost } from '../../../redux/Admin/Admin_post/Admin_post.thunk'
import { Table, Avatar, Tag, Popconfirm, Button, Image, message, Switch } from 'antd'
import { deletePost } from '../../../redux/Admin/Admin_post/Admin_post.thunk'
import { useSocket } from '../../../socket/SocketContext'
import Postdetail from '../../../components/modals/Postdetail'
import { updateHidePost } from '../../../redux/Admin/Admin_post/Admin_post.slice'

const AdminPost = () => {
    const { socket } = useSocket()
    const dispatch = useDispatch();
    const [postdetail, setPostdetail] = useState(false)
    const posts = useSelector((state) => state.adminpost.posts)
    const pagination = useSelector((state) => state.adminpost.pagination);
    const loading = useSelector((state) => state.adminpost.loading);
    const [selectedPost, setSelectedPost] = useState(null);
    useEffect(() => {
        dispatch(getAllPost({ page: 1, limit: 5 }));
    }, [dispatch]);
    const handleTableChange = (pagination) => {
        dispatch(getAllPost({ page: pagination.current, limit: pagination.pageSize }));
    };
    const handledeletePost = async (id) => {


        console.log("đâu r ", id)
        const res = await dispatch(deletePost({ id })).unwrap();
    }
    const handleViewPost = (post) => {
        setSelectedPost(post);
        setPostdetail(true);
    };
    const handleClosePostDetail = () => {
        setPostdetail(false);
        setSelectedPost(null);
    };

    const handleHideChange = async (checked, postId) => {
        const newHide = checked ? true : false;

        const res = await dispatch(hidePost({ id: postId, hide: newHide })).unwrap()
        if (res.success) {

            dispatch(updateHidePost({ id: postId, hide: newHide }));
        }

    };
    const columns = [
        {
            title: 'Người đùng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user?.avatar?.url} alt={user?.username} />
                    <span style={{ marginLeft: 8 }}>{user.username}</span>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'visibility',
            key: 'visibility',

        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
        },
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <div className="flex gap-2 overflow-x-auto">
                    {images?.map((image) => (
                        <div
                            key={image._id}
                            className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
                        >
                            <Image
                                src={image.url}
                                alt="Post content"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            ),


        },
        {
            title: 'Video',
            dataIndex: 'videos',
            key: 'videos',
            render: (videos) => (
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(videos) &&
                        videos.map((video) => (
                            <Image
                                width={100}
                                key={video._id}
                                src="https://placehold.co/159x150?text=Video"
                                alt="Video preview"
                                className="aspect-square w-20 h-20 object-cover rounded-lg"
                                preview={{
                                    destroyOnClose: true,
                                    imageRender: () => (
                                        <video
                                            muted
                                            controls
                                            src={video.url}
                                            className="max-w-[90%] max-h-[80vh] object-contain"

                                        />
                                    ),
                                }}
                            />
                        ))}
                </div>
            ),
        }
        ,
        {
            title: 'Lượt thích ',
            dataIndex: 'likes',
            key: 'likes',
            render: (likes) => (

                <Tag color="red">{likes.length} <i class="bi bi-heart-pulse"></i></Tag>
            ),
        },
        {
            title: 'Bình luận',
            dataIndex: 'commentCount',
            key: 'commentCount',
            render: (count) => (
                <Tag color="blue">{count} <i class="bi bi-chat-left-dots"></i></Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Ẩn',
            dataIndex: 'hide',
            render: (text, record) => (

                <div>

                    <Switch
                        checked={record.hide === true}
                        onChange={(checked) => handleHideChange(checked, record.key)}
                    />
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            fixed: 'right',
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" size="small" onClick={() => handleViewPost(record)}><i className="bi bi-eye"></i></Button>
                    <Popconfirm
                        title="Xóa bài viết"
                        description="Bạn có muốn xóa bài viết này !!!"
                        okText="Yes"
                        onConfirm={() => handledeletePost(record._id)}
                    >
                        <Button type="danger" size="small" className="border border-red-500 text-red-500"><i className="bi bi-x-circle-fill"></i></Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const dataSource = useMemo(() => {
        return posts.map((post) => ({ ...post, key: post._id }));
    }, [posts]);
    return (
        <>quản lí bài viết :

            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                }}
                scroll={{ x: 'max-content' }}

                rowKey={(record) => record._id}
                onChange={handleTableChange}

            />
            <Postdetail isOpen={postdetail} scroll={{ x: 1200 }} onClose={() => handleClosePostDetail()} post={selectedPost} />
        </>
    )
}

export default AdminPost