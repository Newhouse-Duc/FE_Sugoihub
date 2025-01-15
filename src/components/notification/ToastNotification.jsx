import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, UserPlus, Share2,
    ThumbsUp, Gift, Award, Bell, Image,
    X, Volume2, VolumeX, Hexagon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import notification from "../../assets/audio/notification.mp3"
import { useSocket } from '../../socket/SocketContext';
import { useSelector } from 'react-redux';




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

    const getGlowColor = () => {
        switch (data.type) {
            case 'POST_LIKE': return 'shadow-pink-500/50';
            case 'NEW_POST': return 'shadow-blue-500/50';
            case 'POST_COMMENT': return 'shadow-purple-500/50';
            case 'COMMENT_REPLY': return 'shadow-green-500/50';
            case 'COMMENT_LIKE': return 'shadow-orange-500/50';
            case 'FRIEND_REQUEST': return 'shadow-blue-500/50';
            case 'FRIEND_ACCEPT': return 'shadow-emerald-500/50';
            default: return 'shadow-white/50';
        }
    };

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
                transition: { duration: 0.3 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
                absolute w-full max-w-sm 
                backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/95
                border border-gray-800/50 rounded-lg
                shadow-[0_0_15px_rgba(0,0,0,0.3)] ${getGlowColor()}
                transform transition-all duration-500 
                ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            style={{
                translateY: `${offset}px`,
                zIndex: 99999 - index
            }}
        >
            <div className="relative overflow-hidden">
                {/* Futuristic Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_ease-in-out_infinite]" />

                {/* Progress bar */}
                {!isHovered && (
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                        className="h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                        opacity-80 shadow-lg"
                    />
                )}

                <div className="flex items-start p-4 gap-3">
                    {/* Avatar with Hexagon Frame */}
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse blur-md" />
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-0"
                        >
                            <Hexagon className="w-12 h-12 text-gray-600/30" />
                        </motion.div>
                        <img
                            src={data.avatar}
                            alt=""
                            className="relative w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`
                            absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                            bg-gradient-to-r from-blue-500 to-purple-600
                            flex items-center justify-center shadow-lg
                            border border-gray-800
                        `}>
                            {getIcon()}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-base font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {data.username}
                            </p>
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{data.message}</p>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(data.timestamp), { addSuffix: true, locale: vi })}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => onClose(data.id)}
                        className="flex-shrink-0 p-1.5 rounded-full 
                        hover:bg-white/10 transition-colors group"
                    >
                        <X className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ToastContainer = ({ position = 'top-right' }) => {
    const [toasts, setToasts] = useState([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    const userinfor = useSelector((state) => state.auth.userinfor);
    const { socket } = useSocket();
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-20 right-10',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };
    const addToast = useCallback((data) => {
        if (isSoundEnabled) {
            const audio = new Audio(notification);
            audio.play().catch(() => { });
        }
        setToasts(prev => {

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
                    message: notification.text,
                    timestamp: notification.createdAt || new Date(),
                    avatar: notification.sender?.avatar?.url,

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
        <div className={`fixed ${positionClasses[position]}  z-[99999]  w-full max-w-sm`}>



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