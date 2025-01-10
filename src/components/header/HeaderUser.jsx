import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, message, Dropdown } from 'antd';
import { logoutuser } from '../../redux/Auth/Auth.thunk';
import { Link } from 'react-router-dom';
import Notifications from '../notification/Notifications';
import { allNotification } from '../../redux/Notification/Notification.thunk';
import ToastContainer from '../notification/ToastNotification';
const HeaderUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const listUser = useSelector((state) => state.auth.listUser);
    const userinfor = useSelector((state) => state.auth.userinfor)
    const allnotification = useSelector((state) => state.notification.allnotification)
    const filteredUsers = searchTerm.trim() !== ''
        ? (listUser || []).filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleLogout = async () => {
        try {
            const res = await dispatch(logoutuser()).unwrap();
            if (res.success) {
                navigate('/');
            }

        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        }
    };

    const navigationItems = [
        { icon: "bi-house-heart-fill", label: "Trang chủ", link: "/home" },
        { icon: "bi-people-fill", label: "Bạn bè", link: "/request" },
        { icon: "bi-person-plus-fill", label: "Lời mời", link: "/friendrequest" },
        { icon: "bi-chat-dots-fill", label: "Tin nhắn", link: "/messages" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(value.trim() !== '');
    };

    const handleUserClick = (userId) => {
        setSearchTerm('');
        setShowResults(false);
        navigate(userId === userinfor._id ? "/account" : `/user/${userId}`);
    };

    return (
        <div className="relative">
            <div className="navbar   bg-[#97A1F0] px-4 shadow-md fixed top-0 w-full z-50">
                {/* Logo và Tìm kiếm */}
                <div className="navbar-start flex items-center gap-4">
                    <Link to="/home" className="text-2xl font-bold text-primary hidden md:flex">MySocial</Link>
                    <div className="hidden lg:flex relative items-center" ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="input input-bordered input-sm w-72 pl-10 focus:outline-none focus:border-primary text-gray-800"
                        />
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>

                    {/* Icon tìm kiếm cho thiết bị nhỏ */}
                    <button
                        className="lg:hidden btn btn-ghost"
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <i className="bi bi-search text-xl"></i>
                    </button>
                </div>

                {/* Menu chính */}
                <div className="navbar-center md:flex gap-6">
                    {navigationItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="btn btn-ghost btn-circle hover:bg-base-200"
                            title={item.label}
                        >
                            <i className={`bi ${item.icon} text-xl`}></i>
                        </Link>
                    ))}
                </div>

                {/* Menu bên phải */}
                <div className="navbar-end flex items-center gap-2">
                    {/* Thông báo */}
                    <ToastContainer />
                    <Dropdown
                        overlay={<Notifications />}
                        trigger={['click']}
                        placement="bottomRight"
                        arrow={{ pointAtCenter: true }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        overlayStyle={{
                            width: '320px',
                            maxHeight: '80vh',
                        }}
                    >
                        <button
                            className="btn btn-ghost btn-circle"

                        >
                            <div className="indicator">
                                <i className="bi bi-bell-fill text-xl"></i>
                                <span className="badge badge-sm badge-primary indicator-item">3</span>
                            </div>
                        </button>
                    </Dropdown>

                    {/* Avatar và Menu user */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Avatar"
                                    src={userinfor?.avatar?.url}
                                />
                            </div>
                        </div>
                        <ul className="dropdown-content menu menu-sm bg-base-100 rounded-box w-56 mt-3 p-2 shadow-lg">
                            <li>
                                <Link to="/account" className="flex gap-2">
                                    <i className="bi bi-person-circle"></i>
                                    Hồ sơ cá nhân
                                </Link>
                            </li>


                            <li>
                                <a href="/setting" className="flex gap-2">
                                    <i className="bi bi-gear-fill"></i>
                                    Cài đặt
                                </a>
                            </li>
                            <li>
                                <button className="flex gap-2 ">
                                    <label className="swap swap-rotate btn btn-ghost btn-circle">
                                        <input type="checkbox" />

                                        <i className="bi bi-sun-fill swap-on text-xl text-yellow-500"></i>
                                        <i className="bi bi-moon-fill swap-off text-xl text-gray-600"></i>


                                    </label>

                                </button>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <button onClick={handleLogout} className="flex gap-2 text-error">
                                    <i className="bi bi-box-arrow-right"></i>
                                    Đăng xuất
                                </button>
                            </li>


                        </ul>
                    </div>
                </div>
            </div>

            {/* <NotificationsSystem /> */}
            {/* Kết quả tìm kiếm */}
            {showResults && !isSearchOpen && filteredUsers.length > 0 && (
                <div className="absolute top-16 left-32 w-80  rounded-lg shadow-lg z-50  ">
                    <div className="p-3 card glass">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">
                            Kết quả tìm kiếm
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-400 cursor-pointer transition-colors rounded-md"
                                >
                                    {user.avatar.url ? (
                                        <img
                                            src={user.avatar.url}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <i className="bi bi-person text-xl text-primary"></i>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-medium text-zinc-700">{user.username}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal tìm kiếm cho thiết bị nhỏ */}
            <Modal
                title="Tìm kiếm"
                open={isSearchOpen}
                onCancel={() => setIsSearchOpen(false)}
                footer={null}
            >
                <Input
                    prefix={<i className="bi bi-search text-gray-400 mr-2"></i>}
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoFocus
                />
                {/* Kết quả tìm kiếm trong modal */}
                {showResults && filteredUsers.length > 0 && (
                    <div className="mt-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => {
                                    handleUserClick(user._id);
                                    setIsSearchOpen(false);
                                }}
                                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer transition-colors"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <i className="bi bi-person text-xl text-primary"></i>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.username}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HeaderUser;