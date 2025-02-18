import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allfriendship, updateFriend } from '../../redux/FriendShip/FriendShip.thunk';

const FriendRequest = () => {
    const dispatch = useDispatch();
    const receivedRequests = useSelector((state) => state.friendship.receivedRequests);
    const userinfor = useSelector((state) => state.auth.userinfor);

    useEffect(() => {
        if (userinfor?._id) {
            dispatch(allfriendship({ id: userinfor._id }));
        }
    }, [dispatch, userinfor]);

    const handleAccept = (id) => {
        const data = {
            requesterId: id,
            receiverId: userinfor._id,
            status: "accepted",
        };
        dispatch(updateFriend({ data }))
        dispatch(allfriendship({ id: userinfor._id }));
        console.log("Accepted:", data);
    };

    const handleReject = (id) => {
        const data = {
            requesterId: id,
            receiverId: userinfor._id,
            status: "rejected",
        };
        dispatch(updateFriend({ data }))
        dispatch(allfriendship({ id: userinfor._id }));
        console.log("Rejected:", data);
    };

    return (
        <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                Lời mời kết bạn
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedRequests.length > 0 ? (
                    receivedRequests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                    <img
                                        src={
                                            request.requesterId.avatar?.url || "https://avatar.iran.liara.run/public/4"

                                        }
                                        alt={request.requesterId.username}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {request.requesterId.username}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        0 bạn chung
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-4">
                                <button
                                    onClick={() => handleAccept(request.requesterId._id)}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Chấp nhận
                                </button>
                                <button
                                    onClick={() => handleReject(request.requesterId._id)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >

                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg">
                        Không có lời mời kết bạn nào.
                    </p>
                )}
            </div>
        </div>

    );
};

export default FriendRequest;
