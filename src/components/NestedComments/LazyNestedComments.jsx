import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Avatar } from 'antd';
import { MoreHorizontal, Share2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const CommentItem = ({
    comment,
    replyComments,
    onLoadReplies,
    onReply,
    onLike,
    expandedComments,
    setExpandedComments,
    loadingStates,
    setLoadingStates
}) => {
    const isExpanded = expandedComments.includes(comment._id);

    const formatDate = (date) => {
        return formatDistance(new Date(date), new Date(), {
            addSuffix: true,
            locale: vi
        });
    };

    const handleToggleReplies = async () => {
        if (!isExpanded && !replyComments?.some(reply => reply.parentId === comment._id)) {
            setLoadingStates(prev => ({ ...prev, [comment._id]: true }));
            await onLoadReplies(comment._id);
            setLoadingStates(prev => ({ ...prev, [comment._id]: false }));
        }

        setExpandedComments(prev =>
            isExpanded
                ? prev.filter(id => id !== comment._id)
                : [...prev, comment._id]
        );
    };


    const commentReplies = replyComments?.filter(
        reply => reply.parentId === comment._id
    ) || [];

    return (
        <div className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                    <Avatar className="w-8 h-8">
                        <img
                            src={comment?.author?.avatar?.url}
                            alt="avatar"
                            className="rounded-full w-full h-full object-cover"
                        />
                    </Avatar>
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{comment?.author?.username}</p>
                            <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="mt-2 text-gray-700">{comment.content}</p>

                    {comment.images?.length > 0 && (
                        <div className="mt-3 grid gap-2 grid-cols-2">
                            {comment.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Comment ${index + 1}`}
                                    className="rounded-lg object-cover w-full h-32"
                                />
                            ))}
                        </div>
                    )}
                    {comment.gif && (<img
                        key={comment.gif.id}
                        src={comment.gif.url}

                        className="max-w-full  h-28 "
                    />)}

                    <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center">
                            <label className="swap swap-rotate">
                                <input
                                    type="checkbox"
                                    defaultChecked={comment.isLiked}
                                    onChange={() => onLike(comment)}
                                />
                                <i className="bi bi-heart mr-1 swap-off fill-current"></i>
                                <i className="bi bi-arrow-through-heart-fill mr-1 text-red-500 swap-on fill-current"></i>
                            </label>
                            <span className="ml-1">{comment?.likesCount || 0}</span>
                        </div>

                        <button
                            onClick={() => onReply(comment)}
                            className="flex items-center text-gray-500 hover:text-blue-600"
                        >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            <span>{comment.replyCount || 0}</span>
                        </button>



                        {comment.replyCount > 0 && (
                            <button
                                onClick={handleToggleReplies}
                                className="flex items-center text-blue-600 hover:text-blue-700"
                            >
                                {loadingStates[comment._id] ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 mr-1" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 mr-1" />
                                        )}
                                        {isExpanded ? 'Ẩn phản hồi' : `Xem ${comment.replyCount} phản hồi`}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested Replies */}
            {isExpanded && commentReplies.length > 0 && (
                <div className="ml-11 mt-3 space-y-3">
                    {commentReplies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            replyComments={replyComments}
                            onLoadReplies={onLoadReplies}
                            onReply={onReply}
                            onLike={onLike}
                            expandedComments={expandedComments}
                            setExpandedComments={setExpandedComments}
                            loadingStates={loadingStates}
                            setLoadingStates={setLoadingStates}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const LazyNestedComments = ({
    comments,
    replyComments,
    onLoadReplies,
    onReply,
    onLike
}) => {
    const [expandedComments, setExpandedComments] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});

    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    replyComments={replyComments}
                    onLoadReplies={onLoadReplies}
                    onReply={onReply}
                    onLike={onLike}
                    expandedComments={expandedComments}
                    setExpandedComments={setExpandedComments}
                    loadingStates={loadingStates}
                    setLoadingStates={setLoadingStates}
                />
            ))}
        </div>
    );
};

export default LazyNestedComments;