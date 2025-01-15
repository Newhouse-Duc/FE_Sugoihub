import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Tabs, Avatar, Image, Tooltip, Button, Upload, Input, Popconfirm, message, Select, Divider, List, Skeleton, Dropdown, Menu } from 'antd';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { AiFillPicture, AiOutlineUser } from "react-icons/ai";
import { MdOutlineGroupAdd, MdDeleteForever } from "react-icons/md";
import { useSocket } from '../../socket/SocketContext';
import { uploadImageChat, deleteConversation } from '../../redux/Chat/Chat.thunk';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const InforConservation = ({ isOpen, onClose, group }) => {
    const { socket } = useSocket()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [groupName, setGroupName] = useState(group.name);
    const [avatardelete, setAvatarDelete] = useState({})
    const [newadmin, setNewAdmin] = useState();
    const [members, setMembers] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const userinfor = useSelector((state) => state.auth.userinfor)
    const friends = useSelector((state) => state.friendship.friends)
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
    const handleDeleteAvatar = (file) => {
        setAvatarDelete(file)

    }

    const handleConfirm = async () => {
        if (!groupName.trim()) {
            message.error("Tên nhóm không được để trống")
            return;
        }
        try {
            setLoading(true);


            const data = new FormData();
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("images", file.originFileObj);
                }
            });

            let avatar = null;
            if (data.has("images")) {

                const response = await dispatch(uploadImageChat({ data })).unwrap();
                if (response.success) {
                    avatar = response.data;
                }
            }

            const updateData = {
                conversationId: group.conversationId,
                admin: newadmin,
                groupName,
                avatar: avatar,
                avatardelete: avatardelete.publicId

            };

            socket.emit("updategroupchat", updateData);

            setLoading(false);
            message.success("Thay đổi thành công");

        } catch (error) {
            setLoading(false);
            message.error("Có lỗi xảy ra: " + error.message);
        }
    };
    const handleComfirmDelete = async (id) => {
        console.log("xem id có không: ", id)
        const res = await dispatch(deleteConversation({ id })).unwrap()
        if (res.success) {
            onClose()
            message.success("Xóa nhóm thành công")
        }

    }
    const handleChangeAdmin = (value) => {

        setNewAdmin(value)
    }
    const handlechangemembers = () => {

        const data = {

            conversationId: group.conversationId,
            members

        }
        console.log("xem member: ", data)
        socket.emit("addmembers", data);
    }
    const handleDeleteMember = (id) => {

        const data = {
            conversationId: group.conversationId,
            deletemember: id
        }
        console.log("xem xóa: ", data)
        socket.emit("deletemember", data)
    }
    useEffect(() => {
        setGroupName(group.name);
    }, [group]);
    useEffect(() => {

        socket.on("newinforgroupchat", (data) => {
            console.log("xem đi nào ", data)
        });

    }, [])

    const items = [
        {
            key: '1',
            label: 'Thông tin cuộc trò chuyện',
            children: (
                <div>
                    {group.isGroup === true && (
                        <>
                            <div className="flex flex-col items-center gap-3">
                                <Avatar size={100} src={group?.avatar?.url} />
                                <h2 className="text-xl font-medium">{group.name}</h2>
                                <div className="text-gray-500">
                                    Số lượng thành viên: {group.participants.length}
                                </div>
                                <div className="text-gray-500">
                                    Trưởng nhóm: {
                                        group.participants.find(p => p._id === group.admin)?.username
                                    }
                                </div>
                            </div>

                        </>
                    )}
                </div>
            ),
        },
        ...(
            group.admin === userinfor._id ? [
                {
                    key: '2',
                    label: 'Chỉnh sửa cuộc trò chuyện nhóm',
                    children: (
                        <div>
                            <div className="space-y-4">
                                {/* Avatar Upload Section */}
                                <div className="mb-4 flex flex-col items-center text-center">
                                    <h3 className="mb-2">Chỉnh avatar</h3>
                                    <div className="flex justify-center w-full">
                                        <Upload
                                            beforeUpload={() => false}
                                            listType="picture-circle"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={handleChangeUpload}
                                            onRemove={handleDeleteAvatar}
                                            showUploadList={{
                                                showRemoveIcon: true,
                                                showPreviewIcon: true,
                                            }}
                                        >
                                            {fileList.length >= 1 ? null : (
                                                <Button icon={<AiFillPicture />}>Tải ảnh lên</Button>
                                            )}
                                        </Upload>
                                    </div>

                                    {previewImage && (
                                        <Image
                                            wrapperStyle={{ display: 'none' }}
                                            preview={{
                                                visible: previewOpen,
                                                onVisibleChange: setPreviewOpen,
                                            }}
                                            src={previewImage}
                                        />
                                    )}
                                </div>

                                {/* Group Name Section */}
                                <div className="mb-4">
                                    <h3 className="mb-2">Chỉnh tên nhóm</h3>
                                    <Input
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                                        <h3 className="min-w-[120px] mb-0">Trưởng nhóm:</h3>
                                        <Select
                                            defaultValue={
                                                group.participants.find(
                                                    (participant) => participant._id === group.admin
                                                )?.username
                                            }
                                            className="w-full md:w-[200px]"
                                            onChange={handleChangeAdmin}
                                            options={
                                                group.participants
                                                    .filter((participant) => participant._id !== group.admin)
                                                    .map((participant) => ({
                                                        value: participant._id,
                                                        label: participant.username
                                                    }))
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Button
                                        loading={loading}
                                        onClick={handleConfirm}
                                        icon={<i className="bi bi-check-circle" />}
                                        className="w-full md:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 active:bg-green-700 transition duration-200 shadow"
                                    >
                                        Xác nhận thay đổi
                                    </Button>

                                    {userinfor._id === group.admin && (
                                        <Popconfirm
                                            title="Xóa nhóm trò chuyện"
                                            description="Bạn có chắc chắn xóa không lưu ý sẽ không thể hoàn tác"
                                            okText="Đồng ý"
                                            cancelText="Hủy bỏ"
                                            onConfirm={() => handleComfirmDelete(group.conversationId)}
                                        >
                                            <Button className="w-full md:w-auto bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition duration-200 shadow">
                                                <MdDeleteForever /> Xóa nhóm
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </div>
                            </div>
                        </div>
                    ),
                }
            ] : []
        ),
        {
            key: '3',
            label: 'Thành viên',
            children: (
                <div>

                    <div className="space-y-4 p-4">
                        {/* Phần select và button */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select
                                mode="multiple"
                                placeholder="Chọn thành viên"
                                value={members}
                                onChange={(value) => setMembers(value)}
                                className="w-full rounded-lg shadow-sm"
                                allowClear
                                filterOption={(input, option) =>
                                    option?.children?.props?.children[1]?.props?.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {friends.map((friend) => (
                                    <Select.Option key={friend._id} value={friend._id}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <Avatar size="small" icon={<AiOutlineUser />} />
                                            </div>
                                            <span className="flex-grow">{friend.username}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>

                            <Button
                                key="create"
                                disabled={members.length === 0}
                                onClick={handlechangemembers}
                                className="sm:w-48 bg-green-500 text-white px-6 py-2 rounded-lg  active:bg-green-700 transition duration-200 shadow"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <MdOutlineGroupAdd />
                                    <span>Thêm thành viên</span>
                                </div>
                            </Button>
                        </div>

                        {/* Phần danh sách thành viên */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Danh sách thành viên</h3>
                            <div className="max-h-[40vh] min-h-[200px] overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm px-2">

                                <List
                                    dataSource={group.participants}
                                    renderItem={(items) => (
                                        <List.Item key={items._id} className="hover:bg-gray-50">
                                            <List.Item.Meta
                                                avatar={<Avatar src={items.avatar.url} />}
                                                title={
                                                    <div className="font-medium">{items.username}</div>
                                                }
                                                description={
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">

                                                        {items._id === group.admin && (
                                                            <span className="text-blue-500 font-medium">
                                                                (Trưởng nhóm)
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                            />
                                            {items._id !== userinfor._id && (
                                                <div className="cursor-pointer hover:text-blue-500 px-2">
                                                    <Dropdown
                                                        overlay={
                                                            <Menu>
                                                                <Menu.Item key="1" >
                                                                    Xem thông tin
                                                                </Menu.Item>

                                                                {userinfor._id === group.admin && (
                                                                    <Menu.Item key="2" onClick={() => handleDeleteMember(items._id)}>
                                                                        Xóa thành viên
                                                                    </Menu.Item>
                                                                )}
                                                            </Menu>
                                                        }
                                                        trigger={['click']}
                                                        placement="bottomLeft"
                                                    >
                                                        <i className="bi bi-three-dots text-lg"></i>
                                                    </Dropdown>
                                                </div>
                                            )}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {

        if (group.avatar) {
            setFileList([{ url: group.avatar.url, publicId: group.avatar.publicId }])

        }
        socket.on("updatemember", (data) => {

            if (data) {
                console.log("Thông báo mới data:", data);
            }

        });


    }, [group])

    return (
        <Modal
            title="thông tin cuộc trò chuyện nhóm"
            centered
            maskClosable
            getContainer={false}
            open={isOpen}
            closeIcon={() => onClose()}
            onCancel={() => onClose()}
            width={800}
            footer={null}

        >
            <hr />
            <Tabs tabPosition="left" defaultActiveKey="1" items={items} className="min-h-[300px]" />
        </Modal>
    );
};

export default InforConservation;
