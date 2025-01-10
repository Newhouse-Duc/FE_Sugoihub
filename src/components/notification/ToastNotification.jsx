import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, UserPlus, Share2,
    ThumbsUp, Gift, Award, Bell, Image,
    X, Volume2, VolumeX
} from 'lucide-react';
import notification from "../../assets/audio/notification.mp3"
import { useSocket } from '../../socket/SocketContext';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// Toast Notification Component
const Toast = ({ data, onClose, index, total }) => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            const timer = setTimeout(() => {
                onClose(data.id);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [data.id, onClose, isHovered]);

    const getIcon = () => {
        const iconClass = "w-5 h-5 text-white";
        switch (data.type) {
            case 'POST_LIKE': return <Heart className={iconClass} />;
            case 'NEW_POST': return <MessageCircle className={iconClass} />;
            case 'POST_COMMENT': return <MessageCircle className={iconClass} />;
            case 'COMMENT_REPLY': return <MessageCircle className={iconClass} />;
            case 'COMMENT_LIKE': return <Heart className={iconClass} />;
            case 'FRIEND_REQUEST': return <UserPlus className={iconClass} />;
            case 'FRIEND_ACCEPT': return <Award className={iconClass} />;
            default: return <Bell className={iconClass} />;
        }
    };

    const getGradient = () => {
        switch (data.type) {
            case 'POST_LIKE': return 'from-rose-500 to-pink-600';
            case 'NEW_POST': return 'from-blue-500 to-indigo-600';
            case 'POST_COMMENT': return 'from-violet-500 to-purple-600';
            case 'COMMENT_REPLY': return 'from-emerald-500 to-green-600';
            case 'COMMENT_LIKE': return 'from-amber-500 to-orange-600';
            case 'FRIEND_REQUEST': return 'from-indigo-500 to-blue-600';
            case 'FRIEND_ACCEPT': return 'from-teal-500 to-emerald-600';
            default: return 'from-gray-500 to-slate-600';
        }
    };

    // Calculate offset based on index
    const offset = index * -8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{
                opacity: 1,
                y: offset,
                scale: 1,
                transition: {
                    type: 'spring',
                    damping: 15,
                    stiffness: 150,
                },
            }}
            exit={{
                opacity: 0,
                y: -30,
                scale: 0.8,
                transition: { duration: 0.3, ease: 'easeOut' }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`absolute w-full max-w-sm 
            backdrop-blur-lg bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 
            border border-gray-700 rounded-3xl shadow-2xl hover:shadow-3xl
            transform transition-all duration-500 ease-in-out
            ${isHovered ? 'scale-105 bg-opacity-95 shadow-xl' : 'scale-100'}
        `}
            style={{
                translateY: `${offset}px`,
            }}
        >
            {/* Progress bar */}
            {!isHovered && (
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 
               animate-pulse shadow-lg rounded-full"
                />
            )}

            <div className="flex items-start p-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <img
                        src={data.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white bg-gradient-to-br 
                        from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
                    />
                    <div
                        className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full 
        bg-gradient-to-r ${getGradient()} flex items-center justify-center shadow-lg 
        ring-2 ring-white animate-pulse`}
                    >
                        {getIcon()}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                    <p className="text-lg font-semibold text-white mb-1">{data.username}</p>
                    <p className="text-sm text-gray-300">{data.message}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDistanceToNow(new Date(data.timestamp), { addSuffix: true, locale: vi })}</p>
                </div>

                {/* Close button */}
                <button
                    onClick={() => onClose(data.id)}
                    className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                </button>
            </div>
        </motion.div>
    );
};

// Toast Container
const ToastContainer = ({ position = 'top-right' }) => {
    const [toasts, setToasts] = useState([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const userinfor = useSelector((state) => state.auth.userinfor);
    const { socket } = useSocket();

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };

    const addToast = useCallback((data) => {
        if (isSoundEnabled) {
            const audio = new Audio(notification);
            audio.play().catch(() => { });
        }
        setToasts(prev => {
            // Limit to 5 notifications at a time
            const newToasts = [...prev, { ...data, id: Date.now() }];
            if (newToasts.length > 5) {
                return newToasts.slice(-5);
            }
            return newToasts;
        });
    }, [isSoundEnabled]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    useEffect(() => {
        const handleNotification = (notification) => {
            console.log("xem giá trị có không: ", notification)
            if (notification.recipient === userinfor._id) {
                addToast({
                    type: notification.type,
                    username: notification.sender?.username || 'Người dùng',
                    message: notification.message,
                    timestamp: notification.createdAt || new Date(),
                    avatar: notification.sender?.avatar || '/api/placeholder/100/100',
                    image: notification.image
                });
            }
        };

        socket.on("notifipost", handleNotification);
        socket.on("notifilikepost", handleNotification);
        socket.on("notificommentpost", handleNotification);
        socket.on("notifireplycomment", (notification) => {
            if (notification.recipient === userinfor._id && notification.sender !== userinfor._id) {
                handleNotification(notification);
            }
        });

        return () => {
            socket.off("notifipost");
            socket.off("notifilikepost");
            socket.off("notificommentpost");
            socket.off("notifireplycomment");
        };
    }, [socket, userinfor._id, addToast]);

    return (
        <div className={`fixed ${positionClasses[position]} z-50 w-full max-w-sm`}>
            {/* Sound toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`
                    absolute -top-16 right-0 p-3 rounded-full shadow-lg
                    ${isSoundEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                    hover:shadow-xl transition-shadow
                `}
            >
                {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            {/* Toasts */}
            <div className="relative">
                <AnimatePresence initial={false}>
                    {toasts.map((toast, index) => (
                        <Toast
                            key={toast.id}
                            data={toast}
                            onClose={removeToast}
                            index={index}
                            total={toasts.length}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToastContainer;