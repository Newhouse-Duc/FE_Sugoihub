import React, { useEffect, useState } from 'react';
import NotificationsSystem from './ToastNotification';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { FaHeartbeat } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa6";
import { TfiComments } from "react-icons/tfi";
import { MdPersonAddAlt } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { Dropdown, Space, message, Avatar } from 'antd';
import { markNotificationsAsReadOptimistic, removeNotification } from "../../redux/Notification/Notification.slice"
import { maskReadNotifications } from "../../redux/Notification/Notification.thunk"
import { UserOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons';
import { allNotification, deleteNotification } from '../../redux/Notification/Notification.thunk';

const Notifications = () => {


    const dispatch = useDispatch()
    const [skip, setSkip] = useState(0);
    const limit = 5;
    useEffect(() => {
        dispatch(allNotification({ skip, limit }));
    }, [skip, dispatch]);
    const renderIcon = (type) => {
        const iconClasses = "w-4 h-4";
        switch (type) {
            case 'POST_LIKE':
                return <FaHeartbeat className={`${iconClasses} text-red-500`} />;
            case 'NEW_POST':
                return <MdArticle className={`${iconClasses} text-green-500`} />;
            case 'POST_COMMENT':
                return <FaRegCommentDots className={`${iconClasses} text-blue-500`} />;
            case 'COMMENT_REPLY':
                return <TfiComments className={`${iconClasses} text-blue-500`} />;
            case 'COMMENT_LIKE':
                return <FaHeartbeat className={`${iconClasses} text-blue-500`} />;
            case 'FRIEND_REQUEST':
                return <MdPersonAddAlt className={`${iconClasses} text-blue-500`} />;
            case 'FRIEND_ACCEPT':
                return <BsPersonCheck className={`${iconClasses} text-blue-500`} />;
            default:
                return <IoNotificationsCircleOutline className={`${iconClasses} text-yellow-500`} />;
        }
    };

    const allnotification = useSelector((state) => state.notification.allnotification)
    const loading = useSelector((state) => state.notification.loading)
    useEffect(() => {

        const unreadIds = allnotification
            .filter(noti => !noti.isRead)
            .map(noti => noti._id);

        console.log("Đâu nào : ", unreadIds);

        try {
            if (unreadIds.length > 0) {
                setTimeout(() => {
                    dispatch(markNotificationsAsReadOptimistic(unreadIds));
                    dispatch(maskReadNotifications({ data: unreadIds }));
                }, 2000);
            }

        } catch (error) {

            console.error("Error during dispatch: ", error);
            message.error(error || 'Có lỗi xảy ra');
        }

    }, [allnotification]);

    const handlLoadMoreNotification = () => {
        setSkip(skip + limit);
    }
    if (loading) {
        return (
            <div className="dropdown-content menu bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 max-h-[32rem] overflow-hidden">
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MdOutlineNotificationsActive className="w-5 h-5" />
                        Thông báo mới
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[24rem] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">

                        <li

                            className={"skeleton group flex relative items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                            }
                        >
                            <div className="relative flex-shrink-0">
                                <img

                                    className=" skeleton w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm group-hover:ring-blue-200 dark:group-hover:ring-gray-600 transition-all"
                                />

                            </div>

                            <div className="flex-1 min-w-0">

                                <div className="flex flex-col">

                                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
                                        <span className=" skeleton font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">

                                        </span>
                                        <span className=" skeleton ml-1"></span>
                                    </p>
                                    <div className="skeleton h-4 w-20"></div>

                                    <span className="skeleton mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="skeleton h-4 w-28"></div>
                                    </span>

                                </div>

                            </div>



                        </li>

                    </ul>
                </div>
            </div>
        )
    }
    const handledelete = async (notification) => {
        try {

            const res = await dispatch(deleteNotification({ id: notification._id })).unwrap();
            if (res.success) {
                dispatch(removeNotification(notification._id));
                message.success("xóa  thành công")


            }

        } catch (error) {
            console.log(error)
            message.error("Có lỗi xảy ra khi xóa thông báo");
        }


    }


    const itemsNotification = (id) => [
        {
            key: '1',
            label: (
                <div >Xóa</div>
            ),
            onClick: () => handledelete(id),
        },


    ];



    return (
        <>   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 max-h-[32rem] overflow-hidden">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MdOutlineNotificationsActive className="w-5 h-5" />
                    Thông báo mới
                </h2>
            </div>

            <div className="overflow-y-auto max-h-[24rem] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {allnotification?.map((notification, index) => (
                        <li
                            key={`${notification._id}-${index}`}
                            className={`group flex relative items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${!notification.isRead ? 'bg-blue-50/80 dark:bg-gray-700/30' : ''
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <Avatar
                                    size={50}
                                    src={notification.sender.avatar.url}
                                    icon={<UserOutlined />}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm group-hover:ring-blue-200 dark:group-hover:ring-gray-600 transition-all"
                                />

                                <div className="absolute -right-1 -bottom-1">
                                    <div className="p-1 bg-white dark:bg-gray-800 rounded-full">
                                        {renderIcon(notification.type)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug pr-6">
                                        <span className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            {notification.sender.username}
                                        </span>
                                        <span className="ml-1">{notification.text}</span>
                                    </p>
                                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>


                            {!notification.isRead && (
                                <div className="absolute right-4 top-10">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            )}

                            {/* Dropdown 3 chấm */}
                            <Space direction="vertical" className="absolute right-4 top-4 hidden group-hover:block">
                                <Space wrap>
                                    <Dropdown
                                        menu={{

                                            items: itemsNotification(notification),
                                        }}
                                        placement="bottomRight"
                                    >

                                        <BsThreeDots className="w-5 h-5 text-gray-500 hover:text-gray-700" />


                                    </Dropdown>
                                </Space>
                            </Space>
                        </li>
                    ))}
                </ul>
            </div>
            <div>{allnotification.length === 0 && (
                <div className="flex items-center justify-center  text-white text-lg font-semibold rounded-lg shadow-md transition transform hover:scale-105">
                    Chưa có thông báo nào
                </div>

            )}</div>
            <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <a
                    onClick={handlLoadMoreNotification}
                    className="block w-full py-2.5 px-4 text-center text-sm font-medium bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-200 rounded-lg"
                >
                    Xem thêm thông báo
                </a>
            </div>
        </div>

        </>
    );
};

export default Notifications;