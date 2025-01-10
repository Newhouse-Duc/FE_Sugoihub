import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allUser, banUser } from '../../../redux/Admin/Admin_user/Admin_user.thunk';
import { updateUserBan } from '../../../redux/Admin/Admin_user/Admin_user.slice';
import { Switch, Table, Tag, Avatar, Popconfirm, Button } from 'antd';
const AdminUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.adminUser.user);
    const loading = useSelector((state) => state.adminUser.loading)
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




    const columns = [
        {
            title: "Ảnh đại diện",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) =>
                avatar?.url ? <Avatar src={avatar.url} /> : <Avatar icon="user" />,
        },
        {
            title: "Tên người dùng",
            dataIndex: "username",
            key: "username",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
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
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" size="small"><i className="bi bi-eye"></i></Button>
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

    const data = useMemo(() =>
        user.map((item) => ({
            key: item._id,
            avatar: item.avatar,
            username: item.username,
            email: item.email,
            birthDate: item.birthDate,
            isActive: item.isActive,
            ban: item.ban,
            createdAt: item.createdAt,
        })),
        [user]
    );

    return (
        <>
            <div>
                <Table columns={columns} loading={loading} dataSource={data} />
            </div>


        </>
    );
};


export default AdminUser