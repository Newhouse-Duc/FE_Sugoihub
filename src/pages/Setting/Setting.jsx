import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Select, message, Upload, Image, Input, Avatar, Tabs } from 'antd';
import { updateprofileuser } from '../../redux/Auth/Auth.thunk';
import { useFormik } from 'formik'
import { validationDateSchema } from '../../validates/validates';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { changepassword } from '../../redux/Auth/Auth.thunk';
import { motion } from 'framer-motion';
import { userprofile } from '../../redux/Auth/Auth.thunk';
const { Option } = Select;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const Setting = () => {
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [oldpassword, setOldPassword] = useState(null)
    const [newpassword, setNewPassword] = useState(null)
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false)
    const [removeAvatar, setNewRemoveAvatar] = useState(null)
    const userinfor = useSelector((state) => state.auth.userinfor)
    const [daysInMonth, setDaysInMonth] = useState(31);

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

            <div className='my-2'>Thêm ảnh </div>
        </button>

    );
    const handleRemoveAvatar = () => {
        setNewRemoveAvatar(userinfor.avatar.publicId);


    }

    const handlecReset = () => {
        formik.resetForm();
        setNewRemoveAvatar(null)
    }
    const handleChangPassword = async () => {

        if (!oldpassword) {
            message.error("Vui lòng nhập mật khẩu cũ");
            return;
        }
        if (!newpassword) {
            message.error("Vui lòng nhập mật khẩu mới");
            return;
        }


        if (newpassword.length < 6) {
            message.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }


        const data = {
            oldpassword,
            newpassword,
        };

        try {

            const result = await dispatch(changepassword({ data })).unwrap()

            // Xử lý kết quả thành công
            if (result.success) {
                setNewPassword(null)
                setOldPassword(null)
            } else {
                message.error(result.message || "Đổi mật khẩu thất bại");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            message.error("Có lỗi xảy ra khi đổi mật khẩu");
            console.error("Error changing password:", error);
        }
    };

    const birthDate = new Date(userinfor.birthDate);
    const initialBirthDate = {
        day: birthDate.getUTCDate(),
        month: birthDate.getUTCMonth() + 1,
        year: birthDate.getUTCFullYear(),
    };


    const formik = useFormik({
        initialValues: {
            username: userinfor?.username || '',
            bio: userinfor?.bio || '',
            day: initialBirthDate.day || '',
            month: initialBirthDate.month || '',
            year: initialBirthDate.year || '',
        },
        validationSchema: validationDateSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);


                const { day, month, year, ...otherValues } = values;
                const birthDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const birthDate = new Date(birthDateString);


                if (isNaN(birthDate.getTime())) {
                    message.error('Ngày tháng năm sinh không hợp lệ.');
                    return;
                }


                const data = new FormData();
                if (removeAvatar !== null) {
                    data.append('removeAvatar', removeAvatar);
                }
                data.append('username', otherValues.username);
                data.append('bio', otherValues.bio);
                data.append('birthDate', birthDate.toISOString());


                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        data.append('avatar', file.originFileObj);
                    }
                });

                const res = await dispatch(updateprofileuser({ data })).unwrap();


                for (let [key, value] of data.entries()) {
                    console.log(`${key}:`, value);
                }

                if (res.success) {

                    formik.resetForm();
                    setNewRemoveAvatar(null)
                    await dispatch(userprofile()).unwrap();
                } else {
                    message.error('Cập nhật không thành công.');
                }
            } catch (error) {
                console.error('Lỗi trong quá trình cập nhật:', error);
                message.error('Đã xảy ra lỗi khi cập nhật.');
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const year = parseInt(formik.values.year, 10);
        const month = parseInt(formik.values.month, 10);

        if (month && year) {
            const days = new Date(year, month, 0).getDate();
            setDaysInMonth(days);


            if (formik.values.day > days) {
                formik.setFieldValue("day", days);
            }
        } else if (month) {
            const days = new Date(2024, month, 0).getDate();
            setDaysInMonth(days);


            if (formik.values.day > days) {
                formik.setFieldValue("day", days);
            }
        }
    }, [formik.values.month, formik.values.year, formik.values.day]);
    const items = [
        {
            key: '1',
            label: 'Thông tin cá nhân',
            children: (
                <div>
                    <div className="flex items-center justify-center   ">

                        {(!removeAvatar && userinfor?.avatar?.url) && (
                            <div>
                                <div className="dropdown dropdown-right ">

                                    <Avatar tabIndex={0}
                                        src={userinfor?.avatar?.url}
                                        size={88}
                                        className="border border-gray-300"
                                    />
                                    <ul tabIndex={0} className="dropdown-content menu bg-slate-100 rounded-box z-[1] p-2 shadow border">
                                        <li onClick={handleRemoveAvatar}><a>Gỡ ảnh đại diện</a></li>

                                    </ul>
                                </div>

                            </div >
                        )}
                        {(removeAvatar || !userinfor?.avatar?.url) && (
                            <div>
                                <Upload
                                    beforeUpload={() => false}
                                    listType="picture-circle"
                                    fileList={fileList}
                                    className="avatar-uploader"
                                    onPreview={handlePreview}
                                    onChange={handleChangeUpload}
                                    maxCount={1}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>


                                {previewImage && (
                                    <Image
                                        wrapperStyle={{
                                            display: 'none',
                                        }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}

                            </div>
                        )}
                    </div>


                    {/* Form Section */}
                    <div className="space-y-4">
                        <div>
                            <div className="label">
                                <span className="label-text">Tên người dùng</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <i className="bi bi-person-circle"></i>
                                <input type="text" name="username" className="grow" placeholder="Nhập tên người dùng"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </label>
                        </div>

                        <div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Ngày Sinh</label>
                                <div className="flex gap-2">
                                    {/* Ngày */}
                                    <Select
                                        name="day"
                                        value={formik.values.day}
                                        onChange={value => formik.setFieldValue("day", value)}
                                        onBlur={formik.handleBlur}
                                        className="w-24 h-10"
                                        placeholder="Ngày"
                                    >
                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                            <Option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </Option>
                                        ))}
                                    </Select>

                                    {/* Tháng */}
                                    <Select
                                        name="month"
                                        value={formik.values.month}
                                        onChange={value => formik.setFieldValue("month", value)}
                                        onBlur={formik.handleBlur}
                                        className="w-24 h-10"
                                        placeholder="Tháng"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <Option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </Option>
                                        ))}
                                    </Select>

                                    {/* Năm */}
                                    <Select
                                        name="year"
                                        value={formik.values.year}
                                        onChange={value => formik.setFieldValue("year", value)}
                                        onBlur={formik.handleBlur}
                                        className="w-28 h-10"
                                        placeholder="Năm"
                                    >
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <Option key={i} value={new Date().getFullYear() - i}>
                                                {new Date().getFullYear() - i}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                {(formik.touched.day && formik.errors.day) ||
                                    (formik.touched.month && formik.errors.month) ||
                                    (formik.touched.year && formik.errors.year) ? (
                                    <div className="error">
                                        {formik.errors.day || formik.errors.month || formik.errors.year}
                                    </div>
                                ) : null}
                            </div>

                        </div>
                        <div>
                            <div className="label">
                                <span className="label-text">Tiểu sử</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <i className="bi bi-pencil"></i>
                                <input type="text" name="bio" className="grow" placeholder="Nhập tiểu sử"
                                    value={formik.values.bio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </label>
                        </div>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={formik.handleSubmit}
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            Thay đổi
                        </Button>
                    </div>
                </div>
            )
        },
        {
            key: '2',
            label: 'Mật khẩu',
            children: (
                <>
                    <div className="flex items-center justify-center   p-4">
                        <div className="w-full max-w-md bg-white rounded-2xl   p-6 md:p-8">


                            <form className="space-y-6">

                                <div>
                                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu cũ
                                    </label>
                                    <Input.Password
                                        id="oldPassword"
                                        value={oldpassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu cũ"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 transition duration-200"
                                    />
                                </div>

                                {/* Mật khẩu mới */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <Input.Password
                                        id="newPassword"
                                        value={newpassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 transition duration-200"
                                    />
                                </div>

                                {/* Nút Xác Nhận */}
                                <div>
                                    <Button
                                        onClick={handleChangPassword}
                                        type="primary"
                                        disabled={(!oldpassword && !newpassword)}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
                                    >
                                        Thay đổi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )
        },

    ];
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };


    return (
        <>
            <div className="w-full justify-center max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-4 pt-5 ">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full  p-6 md:p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 "
                >
                    <h1 className='text-left text-2xl mb-2 '>Cài đặt tài khoản</h1>
                    <Tabs
                        size='large'
                        tabPosition="left"
                        defaultActiveKey="1"
                        items={items}
                        animated={true}
                        onChange={handlecReset}
                        className="min-h-[75vh] bg-transparent"
                        tabBarStyle={{ borderRight: 'none' }}
                        tabBarGutter={32}
                    />
                </motion.div>
            </div>
        </>
    )
}

export default Setting