import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allUser, banUser } from '../../../redux/Admin/Admin_user/Admin_user.thunk';
import { updateUserBan } from '../../../redux/Admin/Admin_user/Admin_user.slice';
import { Switch, Table, Tag, Avatar, Popconfirm, Button, Select, Input } from 'antd';
import UserDetail from '../../../components/modals/UserDetail'




const { Search } = Input;
const { Option } = Select;
const AdminUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.adminUser.user);
    const loading = useSelector((state) => state.adminUser.loading)
    const [userdetail, setUserDetail] = useState(false)
    const [selecteduser, setSelectedUser] = useState(null)
    const [selectedisactive, setSelectedIsActive] = useState(null)
    useEffect(() => {
        dispatch(allUser());
    }, [dispatch]);
    const handleBanChange = async (checked, userId) => {
        const newBan = checked ? true : false;
        const res = await dispatch(banUser({ id: userId, ban: newBan })).unwrap()
        if (res.success) {

            dispatch(updateUserBan({ id: userId, ban: newBan }));
        }

    };

    const handleviewuser = (user) => {
        setSelectedUser(user);
        setUserDetail(true)
    }

    const [searchText, setSearchText] = useState('');
    const columns = [
        {
            title: "Ảnh đại diện",
            dataIndex: "avatar",
            key: "avatar",
            align: 'center',
            render: (avatar) =>
                avatar?.url ? <Avatar src={avatar.url || "https://avatar.iran.liara.run/public/4"} /> : <Avatar icon="user" />,
        },
        {
            title: "Tên người dùng",
            dataIndex: "username",
            key: "username",
            align: 'center',
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: '250px',
        },
        {
            title: "Tổng bài viết",
            dataIndex: "totalPosts",
            key: "totalPosts",
            align: 'center',
        },
        {
            title: "Số bạn bè",
            dataIndex: "friends",
            key: "friends",
            render: (value) => <a>{value?.length}</a>,
            align: 'center',
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthDate",
            key: "birthDate",

            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trạng thái hoạt động",
            dataIndex: "isActive",
            align: 'center',
            key: "isActive",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "volcano"}>
                    {isActive ? "Đã xác thực" : "Chưa xác thực"}
                </Tag>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: 'Cấm',
            dataIndex: 'ban',
            render: (text, record) => (

                <div>

                    <Switch
                        checked={record.ban === true}
                        onChange={(checked) => handleBanChange(checked, record.key)}
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
                    <Button type="primary" size="small"><i className="bi bi-eye" onClick={() => handleviewuser(record)}></i></Button>

                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có muốn xóa người dùng  "
                        okText="Yes"
                    // onConfirm={() => handledeleteOrder(record.id)}
                    >
                        <Button type="danger" size="small" style={{ border: 'solid 1px red', color: 'red' }}><i className="bi bi-x-circle-fill"></i></Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];


    const filteredProducts = (user || []).filter((u) => {
        const matchesSearch = u.username && u.username.toLowerCase().includes(searchText.toLowerCase());
        const matchesIsActive = selectedisactive === null || selectedisactive === undefined ? true : u.isActive === selectedisactive;
        return matchesSearch && matchesIsActive;
    });
    return (
        <>
            <div class="text-2xl font-bold text-gray-800 bg-gray-100 py-3 px-6 rounded-lg text-center">
                Quản Lý người dùng
            </div>


            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <Search
                            type="text"
                            placeholder="Tìm tên sản phẩm"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-full md:w-1/3 mt-2">
                        <Select
                            placeholder="Lọc theo trạng thái xác thực"
                            className="w-full border rounded-md"
                            allowClear
                            onChange={(value) => setSelectedIsActive(value)}
                        >
                            <Option value={true}>Đã xác thực</Option>
                            <Option value={false}>Chưa xác thực</Option>
                        </Select>
                    </div>
                </div>
            </div>
            <div className='p-4 bg-white rounded-lg shadow-lg'>
                <Table columns={columns} scroll={{ x: 1200 }} loading={loading} dataSource={loading ? [] : filteredProducts} />
                <UserDetail open={userdetail} onClose={() => setUserDetail(false)} user={selecteduser} />
            </div>


        </>
    );
};


export default AdminUser