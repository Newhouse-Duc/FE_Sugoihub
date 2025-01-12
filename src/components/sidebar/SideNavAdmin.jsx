import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";

import {
    FiHome,
    FiMonitor,
    FiUsers,
} from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/logo/Logo_SugoiHub.png"
import { logoutadmin } from '../../redux/Auth/Auth.thunk';

import { useDispatch, useSelector } from 'react-redux';
const SideNavAdmin = () => {
    return (
        <div className="bg-slate-900 text-slate-100 flex">
            <SideNav />

        </div>
    );
};

const SideNav = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);

    const handleLogout = () => {
        dispatch(logoutadmin())
    }

    const menuMapping = {
        "/admin/dashboard": "dashboard",
        "/admin/user": "user",
        "/admin/post": "post",
    };

    useEffect(() => {
        const currentPath = menuMapping[location.pathname];
        if (currentPath) {
            setSelected(currentPath);
        }
    }, [location.pathname]);

    const handleNavigate = (path, title) => {
        setSelected(title);
        navigate(path);
    };

    return (
        <nav className="h-full w-[7vh] bg-slate-950 p-4 flex flex-col items-center gap-2">
            <div><img src={logo} alt="" className="w-12 rounded-full" /></div>

            <NavItem
                title="dashboard"
                selected={selected}
                onClick={() => handleNavigate('/admin/dashboard', 'dashboard')}
            >
                <FiHome />
            </NavItem>
            <NavItem
                title="user"
                selected={selected}
                onClick={() => handleNavigate('/admin/user', 'user')}
            >
                <FiUsers />
            </NavItem>
            <NavItem
                title="post"
                selected={selected}
                onClick={() => handleNavigate('/admin/post', 'post')}
            >
                <FiMonitor />
            </NavItem>
            <NavItem
                title="Đăng xuất"
                selected={selected}
                onClick={handleLogout}

            >
                <RiLogoutCircleLine />
            </NavItem>
        </nav>
    );
};

const NavItem = ({ children, selected, title, onClick }) => {
    return (
        <motion.button
            className={`p-3 text-xl transition-colors relative ${selected === title ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'
                } rounded-md`}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="block relative z-10">{children}</span>

        </motion.button>
    );
};

export default SideNavAdmin