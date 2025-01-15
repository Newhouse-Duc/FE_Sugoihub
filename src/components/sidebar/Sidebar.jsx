import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
    const navigate = useNavigate()
    const mainMenuItems = [
        { icon: 'bi bi-person-fill', label: 'Trang cá nhân', path: '/account' },
        { icon: 'bi bi-chat-dots-fill', label: 'Tin nhắn', path: '/messages' },
        { icon: 'bi bi-people-fill', label: 'Bạn bè', path: '/friends' },
        { icon: 'bi bi-person-plus-fill', label: 'Lời mời kết bạn', path: '/friendrequest' },
        { icon: 'bi bi-gear-fill', label: 'Cài đặt', path: '/setting' },

    ];





    const userinfor = useSelector((state) => state.auth.userinfor)




    return (

        <>



            <div className="drawer xl:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

                <div className="drawer-side mx-1 ">
                    <div className="card bg-gray-500 w-48 shadow-xl   my-1">

                        <div className="card-body">
                            <h2 className="card-title font-bold">{userinfor.username}</h2>
                            <ul className="space-y-1">
                                {mainMenuItems.map((item) => (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className="flex items-center p-3 hover:bg-base-100 rounded-lg transition-colors"
                                        >
                                            <i className={`${item.icon} mr-3 text-lg`}></i>
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="badge badge-primary ml-auto">{item.badge}</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Sidebar;