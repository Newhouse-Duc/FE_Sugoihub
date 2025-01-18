import React from 'react';
import { Modal } from 'antd';
import { Calendar, Mail, Clock, Shield, Ban, Users, BookImage } from 'lucide-react';


const UserDetail = ({ open, onClose, user }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );

    return (
        <Modal
            title={null}
            centered
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            className="rounded-lg overflow-hidden"
            bodyStyle={{ padding: 0 }}
        >
            <div className="relative">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />

                {/* User Avatar */}
                <div className="absolute top-16 left-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                        {user?.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt={user?.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-4xl text-gray-400">
                                    {user?.username?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info Content */}
                <div className="px-8 pt-20 pb-8">
                    <h2 className="text-2xl font-bold mb-1">{user?.username}</h2>
                    <p className="text-gray-500 mb-6">{user?.publicId}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem
                            icon={Mail}
                            label="Email"
                            value={user?.email}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="Ngày sinh"
                            value={formatDate(user?.birthDate)}
                        />
                        <InfoItem
                            icon={Clock}
                            label="Ngày tham gia"
                            value={formatDate(user?.createdAt)}
                        />
                        <InfoItem
                            icon={Shield}
                            label="Trạng thái"
                            value={user?.isActive ?
                                <span className="text-green-500">Đã xác thực</span> :
                                <span className="text-gray-500">Chưa xác thực</span>
                            }
                        />
                        <InfoItem
                            icon={Users}
                            label="Bạn bè"
                            value={user?.friends.length}
                        />
                        <InfoItem
                            icon={BookImage}
                            label="Số bài đăng"
                            value={user?.totalPosts}
                        />
                    </div>

                    {user?.ban && (
                        <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center gap-3">
                            <Ban className="w-5 h-5 text-red-500" />
                            <p className="text-red-600">Tài khoản này đã bị cấm</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default UserDetail;