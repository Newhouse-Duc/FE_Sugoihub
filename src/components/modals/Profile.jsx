import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar } from 'antd';
import { updateprofileuser } from '../../redux/Auth/Auth.thunk';
import { useFormik } from 'formik'
import { validationDateSchema } from '../../validates/validates';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const Profile = ({ isOpen, onClose }) => {

    const dispatch = useDispatch();

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


    const handleClose = () => {
        formik.resetForm();
        setNewRemoveAvatar(null)
        onClose()
    }
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

                // Xử lý ngày tháng năm sinh
                const { day, month, year, ...otherValues } = values;
                const birthDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const birthDate = new Date(birthDateString);

                // Kiểm tra tính hợp lệ của ngày tháng năm sinh
                if (isNaN(birthDate.getTime())) {
                    message.error('Ngày tháng năm sinh không hợp lệ.');
                    return;
                }

                // Tạo FormData để gửi dữ liệu
                const data = new FormData();
                if (removeAvatar !== null) {
                    data.append('removeAvatar', removeAvatar);
                }
                data.append('username', otherValues.username);
                data.append('bio', otherValues.bio);
                data.append('birthDate', birthDate.toISOString()); // Chuyển ngày sang định dạng ISO

                // Thêm avatar nếu có
                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        data.append('avatar', file.originFileObj);
                    }
                });

                const res = await dispatch(updateprofileuser({ data })).unwrap();

                // Log dữ liệu FormData
                for (let [key, value] of data.entries()) {
                    console.log(`${key}:`, value);
                }

                if (res.success) {

                    onClose();
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

        if (year && month) {
            const days = new Date(year, month, 0).getDate();
            setDaysInMonth(days);
        }
    }, [formik.values.month, formik.values.year]);
    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-lg font-semibold">Cập nhật thông tin cá nhân</span>
                    </div>
                }
                centered
                open={isOpen}
                onCancel={() => onClose()}
                maskClosable={false}
                closeIcon={null}
                width={600}
                className="profile-modal"
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleClose}
                        className="hover:bg-gray-100"
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={formik.handleSubmit}
                        loading={loading}
                        disabled={loading}

                    >
                        Xác nhận
                    </Button>,
                ]}
            >
                <div className="flex flex-col gap-6 mt-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 ">

                        {(!removeAvatar && userinfor?.avatar?.url) && (
                            <div>
                                <div className="dropdown dropdown-right ">

                                    <Avatar tabIndex={0}
                                        src={userinfor?.avatar?.url}
                                        size={88}
                                        className="border border-gray-300"
                                    />
                                    <ul tabIndex={0} className="dropdown-content menu bg-slate-100 rounded-box z-[1] w-52 p-2 shadow border">
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
                                    <select
                                        name="day"
                                        value={formik.values.day}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white"
                                    >
                                        <option value="" disabled hidden>Ngày</option>
                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Tháng */}
                                    <select
                                        name="month"
                                        value={formik.values.month}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white"
                                    >
                                        <option value="" disabled hidden>Tháng</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Năm */}
                                    <select
                                        name="year"
                                        value={formik.values.year}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white"
                                    >
                                        <option value="" disabled hidden>Năm</option>
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <option key={i} value={new Date().getFullYear() - i}>
                                                {new Date().getFullYear() - i}
                                            </option>
                                        ))}
                                    </select>
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

                    </div>
                </div>
            </Modal>



        </>
    )
}

export default Profile