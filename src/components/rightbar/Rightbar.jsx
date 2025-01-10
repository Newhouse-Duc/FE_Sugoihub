import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allfriendship } from '../../redux/FriendShip/FriendShip.thunk';

const Rightbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const receivedRequests = useSelector((state) => state.friendship.receivedRequests);
    const userinfor = useSelector((state) => state.auth.userinfor);

    const MAX_DISPLAY = 5; // Số lượng lời mời hiển thị tối đa

    useEffect(() => {
        if (userinfor?._id) {
            dispatch(allfriendship({ id: userinfor._id }));
        }
    }, [dispatch, userinfor]);

    const handleAccept = (id) => {
        console.log(`Accepted friend request from: ${id}`);
    };

    const handleReject = (id) => {
        console.log(`Rejected friend request from: ${id}`);
    };

    const handleViewMore = () => {
        navigate('/friendrequest');
    };

    return (
        <div className="drawer xl:drawer-open drawer-end">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side mx-1">
                <div className="card bg-gray-500 w-48 shadow-xl my-1">
                    <div className="card-body">
                        <div className="text-white text-center font-bold mb-2">Lời mời kết bạn</div>
                        {receivedRequests.length > 0 ? (
                            <>
                                <ul className="space-y-2">
                                    {receivedRequests.slice(0, MAX_DISPLAY).map((request) => (
                                        <li
                                            key={request._id}
                                            className="bg-slate-700 p-3 rounded-lg hover:bg-slate-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="avatar">
                                                    <div className="w-8 mask mask-squircle">
                                                        <img
                                                            src={
                                                                request.requesterId.avatar?.url ||
                                                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                            }
                                                            alt={request.requesterId.username}
                                                            className="object-cover rounded-full border-2 border-slate-500"
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-white text-sm font-medium">
                                                    {request.requesterId.username}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => handleAccept(request.requesterId._id)}
                                                    className="btn btn-xs btn-success flex items-center justify-center space-x-1 w-12"
                                                >
                                                    <i className="bi bi-patch-check"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.requesterId._id)}
                                                    className="btn btn-xs btn-error flex items-center justify-center space-x-1 w-12"
                                                >
                                                    <i className="bi bi-x-octagon"></i>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {receivedRequests.length > MAX_DISPLAY && (
                                    <div className="text-center mt-2">
                                        <button
                                            onClick={handleViewMore}
                                            className="btn btn-sm btn-outline btn-accent"
                                        >
                                            Xem thêm
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-300 text-xs text-center">Không có lời mời nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
