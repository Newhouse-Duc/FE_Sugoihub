
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, PenSquare, Heart, User, Menu, X } from 'lucide-react';
import { BsFillPersonPlusFill, BsWechat, BsBell } from "react-icons/bs";
import { LuBadgePlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Modal, Input, message, Dropdown } from 'antd';
import { logoutuser } from '../../redux/Auth/Auth.thunk';
import Notifications from '../notification/Notifications';
import { IoSettingsOutline } from "react-icons/io5";
import ToastContainer from '../notification/ToastNotification';
import { FiEdit, FiChevronDown, FiTrash, FiShare, FiPlusSquare } from "react-icons/fi";
import CreatePost from '../../components/modals/CreatePost';
import logo from '../../assets/logo/Logo_SugoiHub.png'
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../socket/SocketContext';
const HeaderUser = () => {
    const { socket } = useSocket()
    const [isScrolled, setIsScrolled] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [numbernotify, setNumberNotify] = useState(null)
    const [createPost, setOpenCreatePost] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const listUser = useSelector((state) => state.auth.listUser);
    const userinfor = useSelector((state) => state.auth.userinfor);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredUsers = searchTerm.trim() !== ''
        ? (listUser || []).filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        const handleNotificationCount = () => {
            const data = { id: userinfor._id };
            message.success("có thông báo mới kìa ")
            socket.emit("countnotification", data);
        };
        socket.on("notifipost", handleNotificationCount);
        socket.on("notifilikepost", handleNotificationCount);
        socket.on("notificommentpost", handleNotificationCount);
    }, [socket])
    useEffect(() => {
        const data = { id: userinfor._id };

        socket.emit("countnotification", data);

        socket.on("notificationcount", (data) => {

            setNumberNotify(data)
        })

    }, [socket])
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
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(value.trim() !== '');
    };
    const handleSearch = () => {

        setIsSearchOpen(true)

    }
    const handleCreatePost = () => {
        setOpenCreatePost(true)
    }

    const handleUserClick = (userId) => {
        setSearchTerm('');
        setShowResults(false);
        navigate(userId === userinfor._id ? "/account" : `/user/${userId}`);
    };
    const navItems = [
        { icon: Home, path: '/home', label: 'Trang chủ' },
        { icon: Search, onClick: handleSearch, label: 'Tìm kiếm' },
        { icon: BsFillPersonPlusFill, path: '/friendrequest', label: 'Kết bạn' },
        { icon: LuBadgePlus, onClick: handleCreatePost, label: 'Tạo bài viết' },
        { icon: BsWechat, path: '/messages', label: 'Tin nhắn' },

        { icon: User, path: '/account', label: 'account' },
    ];
    const navigatelink = (navi) => {
        navigate(navi);
        setIsMobileMenuOpen(false)
        setOpen(false)
    }



    const navbarVariants = {
        hidden: { y: -100 },
        visible: {
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };
    const wrapperVariants = {
        open: {
            scaleY: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        closed: {
            scaleY: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.1,
            },
        },
    };
    const itemVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: {
                when: "beforeChildren",
            },
        },
        closed: {
            opacity: 0,
            y: -15,
            transition: {
                when: "afterChildren",
            },
        },
    };

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };
    const handleDropdownToggle = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    return (
        <>

            {/* Desktop Navbar */}
            <motion.nav
                variants={navbarVariants}
                initial="hidden"
                animate="visible"
                className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-white/80 backdrop-blur-md shadow-md "
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/home" className="text-2xl font-bold text-primary hidden md:flex">
                            <img src={logo} className="h-12 w-12" alt="Logo" />
                        </Link>

                        {/* Navigation Items */}
                        <div className="flex items-center space-x-8">
                            {navItems.slice(0, 5).map((item, index) => (
                                <motion.div
                                    key={item.label || index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={item.onClick}
                                        className={`flex items-center space-x-1 group ${location.pathname === item.path
                                            ? 'text-black'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <item.icon className="w-8 h-8" />
                                        <span className="text-sm font-medium hidden xl:block">
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <CreatePost isOpen={createPost} onClose={() => setOpenCreatePost(false)} />
                        {/* Right Items (Notifications, User) */}
                        <div className="flex items-center space-x-4">
                            <Dropdown
                                dropdownRender={() => (
                                    <div
                                        style={{
                                            width: '320px',
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <Notifications />
                                    </div>
                                )}
                                trigger={['click']}
                                placement="bottomRight"
                                open={isDropdownOpen}
                                onOpenChange={setIsDropdownOpen}
                                destroyPopupOnHide={true}

                            >
                                <button className="btn btn-ghost btn-circle" >
                                    <div className="indicator">
                                        <BsBell className='w-8 h-8' />
                                        <span className="badge badge-sm bg-[#00CDB8] indicator-item ">{numbernotify || 0}</span>
                                    </div>
                                </button>
                            </Dropdown>

                            <motion.div animate={open ? "open" : "closed"} className="relative  items-center space-x-1 group ">

                                <button
                                    onClick={() => setOpen((pv) => !pv)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-800  transition-colors"
                                >
                                    <User className='w-8 h-8' />

                                </button>

                                <motion.ul
                                    initial={wrapperVariants.closed}
                                    variants={wrapperVariants}
                                    style={{ originY: "top", translateX: "-50%" }}
                                    className="flex flex-col gap-2 p-2 rounded-lg bg-white  shadow-xl absolute top-[120%] left-[10%] w-30 overflow-hidden  "
                                >
                                    <Option key="account" setOpen={setOpen} Icon={FiEdit} text="Trang cá nhân" onClick={() => navigatelink("/account")} />
                                    <Option key="settings" setOpen={setOpen} Icon={IoSettingsOutline} text="Cài đặt tài khoản" onClick={() => navigatelink("/setting")} />

                                    <Option key="logout" setOpen={setOpen} Icon={FiTrash} text="Đăng xuất" onClick={handleLogout} />
                                </motion.ul>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </motion.nav>
            <ToastContainer />
            {/* Mobile Navbar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-t">
                <div className="flex justify-between items-center px-4 py-2">
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={item.onClick}
                            className={`p-2 rounded-full ${location.pathname === item.path
                                ? 'text-black bg-gray-100'
                                : 'text-gray-500'
                                }`}
                        >
                            <item.icon className="w-8 h-8" />
                        </Link>
                    ))}
                    {/* Add Notification Dropdown for Mobile */}
                    <Dropdown
                        dropdownRender={() => (
                            <div
                                style={{
                                    width: '320px',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                }}
                            >
                                <Notifications />
                            </div>
                        )}
                        trigger={['click']}
                        placement="bottomRight"
                        destroyPopupOnHide={true}
                    >
                        <button
                            className={` rounded-full ${isDropdownOpen ? 'text-black bg-gray-100' : 'text-gray-500'} indicator`}

                        >
                            <BsBell className="w-8 h-8" />
                            <span className="badge badge-sm bg-[#00CDB8] indicator-item ">{numbernotify || 0}</span>
                        </button>
                    </Dropdown>
                    <Link
                        to="/account"
                        className={`p-2 rounded-full ${location.pathname === '/account'
                            ? 'text-black bg-gray-100'
                            : 'text-gray-500'
                            }`}
                    >
                        <User className="w-8 h-8" />
                    </Link>

                </div>
            </div>

            {/* Mobile Menu Button with Dropdown */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
                <button
                    className="p-2 rounded-full bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="fixed bottom-16 right-4 bg-white rounded-lg shadow-lg w-48 overflow-hidden"
                        >
                            <ul className="flex flex-col gap-2 p-2">
                                <Option key="setting" Icon={FiEdit} text="Cài đặt" onClick={() => navigatelink("/setting")} />
                                <Option key="logout" Icon={FiTrash} text="Đăng xuất" onClick={handleLogout} />
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>


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

        </>
    );
};
const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};

const Option = ({ Icon, text, onClick }) => {
    return (
        <motion.li
            whileTap={{ scale: 0.95 }}

            onClick={onClick}
            className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
        >
            <motion.span variants={actionIconVariants}>
                <Icon className="w-4 h-4" />
            </motion.span>

            <span>{text}</span>
        </motion.li>
    );
};

export default HeaderUser;