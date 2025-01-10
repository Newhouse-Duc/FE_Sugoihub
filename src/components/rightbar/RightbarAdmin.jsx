import React, { useState, useEffect } from "react";
import {
    FiBarChart,
    FiChevronDown,
    FiChevronsRight,
    FiDollarSign,
    FiHome,
    FiMonitor,
    FiShoppingCart,
    FiTag,
    FiUsers,
} from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import logo from "../../assets/logo/Logo_SugoiHub.png"
const Menu = ({ Icon, title, onClick, open, notifs, selected }) => {
    return (
        <motion.button
            layout
            onClick={onClick}
            className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
        >
            <motion.div
                layout
                className="grid h-full w-10 place-content-center text-lg"
            >
                <Icon />
            </motion.div>
            {open && (
                <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="text-xs font-medium"
                >
                    {title}
                </motion.span>
            )}

            {notifs && open && (
                <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    style={{ y: "-50%" }}
                    transition={{ delay: 0.5 }}
                    className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
                >
                    {notifs}
                </motion.span>
            )}
        </motion.button>
    );
};

const Toggleclose = ({ open, setOpen }) => {
    return (
        <motion.button
            layout
            onClick={() => setOpen((pv) => !pv)}
            className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
        >
            <div className="flex items-center p-2">
                <motion.div
                    layout
                    className="grid size-10 place-content-center text-lg"
                >
                    <FiChevronsRight
                        className={`transition-transform ${open && "rotate-180"}`}
                    />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium "
                    >
                        Hide
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
};


const LogoBrand = () => {

    return (
        <motion.div
            layout
            className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
        >
            <div><img src={logo} alt="" className="w-24 rounded-full " /></div>

        </motion.div>
    );
};
const Title = ({ open }) => {
    return (
        <div className="mb-3 border-b border-slate-300 pb-3">
            <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
                <div className="flex items-center gap-2">
                    <LogoBrand />
                    {open && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.125 }}
                        >
                            <span className="block text-xs font-semibold text-slate-500">SugoiHub</span>
                            <span className="block text-xs text-slate-500">Quản trị</span>
                        </motion.div>
                    )}
                </div>

                {open && <div className="dropdown dropdown-hover" >
                    <div tabIndex={0} role="button" ><FiChevronDown className=" mr-2" /></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a>Đăng xuất</a></li>
                        <li><a>Cài đặt tài khoản </a></li>
                    </ul> </div>}
            </div>
        </div>
    );
};

const RightbarAdmin = ({ open, setOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState("");


    const menuMapping = {
        "/admin/dashboard": "Trang chủ",
        "/admin/user": "Quản lí người dùng",
        "/admin/post": "Quản lí bài viết",
    };


    useEffect(() => {
        const currentTitle = menuMapping[location.pathname];
        if (currentTitle) {
            setSelected(currentTitle);
        }
    }, [location.pathname]);
    const handleNavigate = (path, title) => {
        setSelected(title);
        navigate(path);
    };
    return (
        <motion.nav
            layout
            className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
            style={{ width: open ? "225px" : "fit-content" }}
        >
            <Title open={open} />
            <div className="space-y-1">
                <Menu
                    Icon={FiHome}
                    title="Trang chủ"
                    onClick={() => handleNavigate('/admin/dashboard', "Trang chủ")}
                    open={open}
                    selected={selected}
                />
                <Menu
                    Icon={FiUsers}
                    title="Quản lí người dùng"
                    onClick={() => handleNavigate('/admin/user', "Quản lí người dùng")}
                    open={open}
                    selected={selected}
                />
                <Menu
                    Icon={FiMonitor}
                    title="Quản lí bài viết"
                    onClick={() => handleNavigate('/admin/post', "Quản lí bài viết")}
                    open={open}

                    selected={selected}
                />
            </div>
            <Toggleclose open={open} setOpen={setOpen} />
        </motion.nav>
    );
};

export default RightbarAdmin