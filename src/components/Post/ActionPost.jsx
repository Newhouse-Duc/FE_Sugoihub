import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../../redux/Post/Post.thunk';

import { useSocket } from '../../socket/SocketContext';
import { message } from 'antd';
const ActionPost = ({ post, onCommentClick }) => {

    const { socket } = useSocket();
    const dispatch = useDispatch()


    const userinfor = useSelector((state) => state.auth.userinfor)

    const handleLikePost = async (post) => {
        const data = {
            id: userinfor._id,
            postId: post._id
        }
        try {
            const res = await dispatch(likePost({ data })).unwrap();
            if (res.success && res.data.isLiked && post.user._id !== userinfor._id) {
                message.success("Đã thích bài viết")
                const newlike = {
                    recipient: post.user._id,
                    entityId: post._id,
                    sender: userinfor._id,
                    entityType: 'POST',
                    type: "POST_LIKE",
                    text: "đã thích bài viết của bạn"
                };
                socket.emit("likepost", newlike);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi: ", error);
        }

    }

    const handleCommentClick = () => {
        if (onCommentClick) {
            onCommentClick(post);
        }
    };



    return (
        <>
            <div className="flex items-center justify-between pt-4 px-2">

                <label className="swap swap-rotate">
                    <input type="checkbox" checked={post.isLiked} onChange={() => handleLikePost(post)} />

                    <div className="swap-off flex items-center space-x-2 p-2">
                        <i className="swap-off bi bi-activity text-gray-500 text-xl"></i>

                        <span className="text-sm text-gray-600">{post.likesCount}</span>
                    </div>
                    <div className="swap-on flex items-center space-x-2 p-2">
                        <i className="bi bi-heart-pulse text-red-500 text-xl"></i>
                        <span className="text-sm text-gray-600">{post.likesCount}</span>
                    </div>
                </label>


                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleCommentClick} >
                    <i className="bi bi-chat-square-heart text-gray-500 text-xl"></i>
                    <span className="text-sm text-gray-600">{post.commentCount}</span>
                </button>

                {(post.user._id !== userinfor._id) &&
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="bi bi-arrow-repeat text-gray-500 text-xl"></i>
                        <span className="text-sm text-gray-600">Đăng lại</span>
                    </button>
                }
            </div>
        </>
    )
}

export default ActionPost