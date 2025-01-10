import React, { useEffect, useState } from 'react';
import { Button, Modal, message, Input, Select, Upload, Image, Popover, Avatar } from 'antd';
import { AiFillPicture, AiOutlineUser } from "react-icons/ai";
import { createConservation } from '../../redux/Chat/Chat.thunk';
import { useDispatch, useSelector } from 'react-redux';
import { listfriend } from '../../redux/Auth/Auth.thunk';


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const CreateGroupChat = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const userinfor = useSelector((state) => state.auth.userinfor)
    const listFriend = useSelector((state) => state.auth.listFriend)
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
    const handleCreate = async () => {
        if (!groupName || members.length === 0) {
            message.error('Vui lòng nhập đủ thông tin!');
            return;
        }
        try {


            setLoading(true);
            const membersData = JSON.stringify([...members, userinfor._id]);
            const data = new FormData()
            data.append("groupName", groupName);
            data.append("members", membersData);
            data.append("admin", userinfor._id);
            data.append("isGroup", true);


            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("avatar", file.originFileObj);
                }
            });
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }
            const res = await dispatch(createConservation({ data })).unwrap();
            if (res.success) {
                message.success('Nhóm đã được tạo thành công!');
                setGroupName('')
                setMembers([])
                setFileList([])
                onClose();
                setLoading(false);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi")
            console.log("xem lỗi ", error)
        } finally {
            setLoading(false);
        }


    };
    useEffect(() => {
        dispatch(listfriend({ id: userinfor._id }))
    }, [userinfor])

    return (
        <Modal
            open={isOpen}
            centered
            getContainer={false}
            maskClosable={false}
            onCancel={() => onClose()}
            footer={[
                <Button key="cancel" onClick={() => onClose()} style={{ width: '100px' }}>
                    Hủy
                </Button>,
                <Button
                    key="create"
                    onClick={handleCreate}
                    loading={loading}
                    className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition duration-200 shadow"
                >
                    Tạo
                </Button>,
            ]}
            width={600}
            title="Tạo Nhóm Chat"
        >
            <div className="w-full flex justify-center">
                <div className='flex flex-col justify-center items-center'>
                    <label className="block text-sm font-medium text-gray-700">Chọn ảnh nhóm </label>
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChangeUpload}
                        className="w-full"
                        showUploadList={{
                            showRemoveIcon: true,
                            showPreviewIcon: true,
                        }}
                    >


                        {fileList.length >= 1 ? null : <Button icon={<AiFillPicture />}>Tải ảnh lên</Button>}
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
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên nhóm</label>
                    <Input
                        placeholder="Nhập tên nhóm..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="rounded-lg shadow-md"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Thêm thành viên
                    </label>
                    <Select
                        mode="multiple"
                        placeholder="Chọn thành viên"
                        value={members}
                        onChange={(value) => setMembers(value)}
                        className="w-full rounded-lg shadow-sm "
                        allowClear
                        filterOption={(input, option) =>
                            option?.children?.props?.children[1]?.props?.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {listFriend.map((friend) => (
                            <Select.Option key={friend._id} value={friend._id}>
                                <div className="flex items-center gap-3 ">
                                    <div className="flex-shrink-0">
                                        <Avatar size="small" icon={<AiOutlineUser />} />

                                    </div>
                                    <span className="flex-grow">{friend.username}</span>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </div>


            </div>

        </Modal>
    );
};

export default CreateGroupChat;
