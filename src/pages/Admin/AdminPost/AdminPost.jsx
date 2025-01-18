import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getAllPost, hidePost } from '../../../redux/Admin/Admin_post/Admin_post.thunk'
import { Table, Avatar, Tag, Popconfirm, Button, Image, message, Switch, Input, Select } from 'antd'
import { deletePost } from '../../../redux/Admin/Admin_post/Admin_post.thunk'
import { useSocket } from '../../../socket/SocketContext'
import Postdetail from '../../../components/modals/Postdetail'
import { updateHidePost } from '../../../redux/Admin/Admin_post/Admin_post.slice'


const { Search } = Input;
const { Option } = Select;
const AdminPost = () => {
    const { socket } = useSocket()
    const dispatch = useDispatch();
    const [postdetail, setPostdetail] = useState(false)
    const posts = useSelector((state) => state.adminpost.posts)
    // const pagination = useSelector((state) => state.adminpost.pagination);
    const loading = useSelector((state) => state.adminpost.loading);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selecteduser, setSelectedUser] = useState('')
    const [selectedvisibility, setSelectedvisibility] = useState(null)
    const [selectedhide, setSelectedHide] = useState(null)

    const [filters, setFilters] = useState({
        username: '',
        visibility: null,
        hide: null
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5
    });
    const filteredPosts = useMemo(() => {
        return (posts || []).filter(post => {
            // Lọc theo tên người dùng
            const usernameMatch = !filters.username || (post.user?.username?.toLowerCase().includes(filters.username.toLowerCase()));

            // Lọc theo trạng thái hiển thị
            const visibilityMatch = filters.visibility === null || post.visibility === filters.visibility;

            // Lọc theo trạng thái ẩn
            const hideMatch = filters.hide === null ? true : post.hide === filters.hide;

            return usernameMatch && visibilityMatch && hideMatch;
        });
    }, [posts, filters]);




    const paginatedData = useMemo(() => {
        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredPosts.slice(startIndex, endIndex);
    }, [filteredPosts, pagination]);
    const handleFiltersChange = useCallback((type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value || null// Giá trị null khi bộ lọc bị xóa
        }));
        console.log('Filters:', filters);
        console.log('Filtered Posts:', filteredPosts);
        setPagination(prev => ({
            ...prev,
            current: 1 // Reset lại trang
        }));
    }, []);

    useEffect(() => {
        console.log('Filters:', filters);

    }, [filters])



    const handleTableChange = useCallback((newPagination) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize
        });
    }, []);
    useEffect(() => {
        dispatch(getAllPost({ page: 1, limit: 1000 }));
    }, [dispatch]);
    // const handleTableChange = (pagination) => {
    //     dispatch(getAllPost({ page: pagination.current, limit: pagination.pageSize }));
    // };
    const handledeletePost = async (id) => {



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
            render: (value) => {
                switch (value) {
                    case 'public':
                        return (
                            <Tag color="green">
                                Công khai
                            </Tag>
                        );
                    case 'friends':
                        return (
                            <Tag color="blue">
                                Bạn bè
                            </Tag>
                        );
                    case 'private':
                        return (
                            <Tag color="red">
                                Riêng tư
                            </Tag>
                        );
                    default:
                        return <Tag>Không xác định</Tag>;
                }
            },

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
                        onChange={(checked) => handleHideChange(checked, record._id)}
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
        <>
            <div class="text-2xl font-bold text-gray-800 bg-gray-100 py-3 px-6 rounded-lg text-center">
                Quản Lý Bài Viết
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <Search
                            placeholder="Tìm người dùng"
                            onChange={(e) => handleFiltersChange('username', e.target.value)}
                            className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-full md:w-1/3 mt-2">
                        <Select
                            placeholder="Lọc theo trạng thái bài đăng"
                            className="w-full border rounded-md"
                            allowClear
                            onChange={(value) => handleFiltersChange('visibility', value || null)}
                        >
                            <Option value="public">Công khai</Option>
                            <Option value="friends">Bạn bè</Option>
                            <Option value="private">Riêng tư</Option>
                        </Select>
                    </div>
                    <div className="w-full md:w-1/3 mt-2">
                        <Select
                            placeholder="Lọc bài viết ẩn"
                            className="w-full border rounded-md"
                            allowClear
                            onChange={(value) => handleFiltersChange('hide', value)}
                        >
                            <Option value={true}>Đã ẩn</Option>

                        </Select>

                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={loading ? [] : paginatedData}
                loading={loading}
                pagination={{
                    ...pagination,
                    total: filteredPosts.length,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15']
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