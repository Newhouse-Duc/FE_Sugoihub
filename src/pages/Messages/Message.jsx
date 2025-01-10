import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { getConservationId, getMessageChat, uploadImageChat } from '../../redux/Chat/Chat.thunk';
import InputEmoji from "react-input-emoji";
import { useSocket } from '../../socket/SocketContext';
import { Button, message, Select, Upload, Image, Popover, Avatar } from 'antd';
import { addMessage, deleteMessage, updateMessageStatus } from '../../redux/Chat/Chat.sllice';
import { MdOutlineGroupAdd } from "react-icons/md";
import CreateGroupChat from '../../components/modals/CreateGroupChat';
import livechat from "../../assets/audio/livechat.mp3"
import { IoInformationCircleOutline } from "react-icons/io5";
import InforConservation from '../../components/modals/InforConservation';
import { FaTrash } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { MdOutlineGroups3 } from "react-icons/md";
import { motion } from 'framer-motion';

import { voice } from '../../redux/Chat/Chat.thunk';
const chatSound = new Audio(livechat);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const Message = () => {
    const { socket, onlineUsers } = useSocket();
    const dispatch = useDispatch()
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [showFriendsList, setShowFriendsList] = useState(true);
    const [selectedConservation, setSelectedConservation] = useState(null)
    const userinfor = useSelector((state) => state.auth.userinfor);
    const conversation = useSelector((state) => state.chat.conversation)
    const [showUpload, setShowUpload] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [modalCreateGroup, setModalCreateGroup] = useState(false)
    const [modalInfor, setModalInfor] = useState(false)
    const [loadinglistchat, setLoadingListChat] = useState(false)
    const chats = useSelector((state) => state.chat.chats)


    const handleClickUpload = () => {
        setShowUpload(!showUpload);
    };
    const handleChangeUpload = ({ fileList: newFileList, file }) => {
        if (file.status === 'error') {
            message.error(`${file.name} tải lên thất bại.`);
            return;
        }
        setFileList(newFileList);
    };
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    useEffect(() => {
        if (isMobile && selectedConservation) {
            setShowFriendsList(false);
        } else {
            setShowFriendsList(true);
        }
    }, [isMobile, selectedConservation]);
    const handleConversationSelect = (conversation) => {
        setSelectedConservation(conversation);
        if (isMobile) {
            setShowFriendsList(false);
        }
    };
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    useEffect(() => {

        setLoadingListChat(true);


        const fetchData = async () => {
            try {
                await dispatch(getConservationId()).unwrap();
            } catch (error) {
                console.error('Lỗi khi fetch dữ liệu:', error);
            } finally {

                setLoadingListChat(false);
            }
        };

        fetchData();
    }, [dispatch]);
    useEffect(() => {
        if (selectedConservation) {
            socket.emit("joinRoom", selectedConservation.conversationId);
            dispatch(getMessageChat({ conversationId: selectedConservation.conversationId }))
        }


    }, [selectedConservation, socket]);
    useEffect(() => {
        if (selectedConservation && socket) {

            const handleMessage = (message) => {

                dispatch(addMessage(message));
                if (message.sender._id !== userinfor._id) {
                    socket.emit("messageRead", {
                        messageId: message._id,
                        seenBy: userinfor._id,
                        status: "read",
                        roomId: selectedConservation.conversationId,
                    });
                    chatSound.play();
                }
                scrollToBottom();

            };
            socket.on("receiveMessage", handleMessage);
            const handleMessageRead = (data) => {
                console.log("nhận thông tin mới : ", data)
                dispatch(updateMessageStatus({
                    messageId: data._id,
                    status: data.status,
                    seenBy: data.seenBy
                }));
            };

            socket.on("messageRead", handleMessageRead);

            return () => {
                socket.off("receiveMessage", handleMessage);
                socket.off("messageRead", handleMessageRead);

            };
        }
    }, [selectedConservation, socket, dispatch]);
    const sendMessage = async () => {
        if (newMessage.trim() !== "" || fileList.length > 0 || audioBlob) {
            setIsSending(true);
            const data = new FormData();

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("images", file.originFileObj);
                }
            });

            try {
                let voices = null;
                if (audioBlob) {
                    voices = await uploadAudio(audioBlob);
                }
                let images = [];
                if (fileList.length > 0) {
                    const response = await dispatch(uploadImageChat({ data })).unwrap();
                    if (response.success) {
                        images = response.data;
                    }
                }


                const messageData = {
                    conversationId: selectedConservation.conversationId,
                    roomId: selectedConservation.conversationId,
                    sender: userinfor._id,
                    content: newMessage,
                    images,
                    voices
                };


                socket.emit("sendMessage", messageData);


                setNewMessage("");
                setFileList([]);
                setShowUpload(false);
                setAudioBlob(null);
                scrollToBottom();

            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
            finally {
                setIsSending(false);
            }
        }
    };


    const handleBackToList = () => {
        setShowFriendsList(true);
        if (isMobile) {
            setSelectedFriend(null);
        }
    };
    const messageEndRef = useRef(null);
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats, newMessage, isSending]);
    const handleDeleteMessage = (messageId) => {
        dispatch(deleteMessage(messageId));
        message.success(`xóa tin nhắn thành công ${messageId}`)
    }
    const Content = ({ messageId }) => (
        <div>
            <p
                onClick={() => handleDeleteMessage(messageId)}
                className="cursor-pointer"
            >
                <i className="bi bi-trash3-fill text-red-600"> Xóa tin nhắn</i>
            </p>
        </div>
    );

    //// voice
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const MAX_RECORDING_TIME = 1 * 60 * 1000;
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                audioChunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                }
            }, MAX_RECORDING_TIME);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };
    const clearAudio = () => {
        setAudioBlob(null);
        setIsRecording(false);
    }
    const uploadAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice-message.wav');

        try {
            const res = await dispatch(voice({ data: formData })).unwrap()



            if (res.success) {
                return res.data
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading audio:', error);
            alert('Failed to upload voice message.');
        }
    };

    return (
        <div className="w-full justify-center max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-4">

            <div className="w-full p-2 md:p-5 border border-gray-300 rounded-lg shadow-xl bg-gray">
                <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] ">
                    {/* Friends List */}
                    {(showFriendsList || !isMobile) && (
                        <div className="w-full md:w-80 bg-[#F2DDDC] border-b md:border-r border-base-300">
                            {/* Header */}
                            <div className="p-4 border-b border-base-300 shadow-sm">
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">
                                        <i className="bi bi-chat-heart"></i>
                                        <h2 className="font-semibold text-[#2E2E2E] text-lg">Tin nhắn</h2>
                                    </div>


                                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors" onClick={() => setModalCreateGroup(true)}>
                                        <MdOutlineGroupAdd />
                                    </button>

                                </div>
                            </div>
                            <CreateGroupChat isOpen={modalCreateGroup} onClose={() => setModalCreateGroup(false)} />
                            {/* Search Bar */}
                            <div className="p-4 border-b border-base-300 shadow-sm">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tin nhắn..."
                                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 transition-all duration-300 ease-in-out focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                    <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"></i>
                                </div>
                            </div>
                            {loadinglistchat ? (
                                <div className="flex w-52 flex-col gap-4">
                                    <div className="   gap-3 p-3 md:p-4 flex items-center">
                                        <div className="  skeleton h-12 w-12 shrink-0 rounded-full"></div>
                                        <div className="flex flex-col gap-4">
                                            <div className="skeleton h-4 w-20"></div>
                                            <div className="skeleton h-4 w-28"></div>
                                        </div>
                                    </div>
                                    <div className="   gap-3 p-3 md:p-4 flex items-center">
                                        <div className="  skeleton h-12 w-12 shrink-0 rounded-full"></div>
                                        <div className="flex flex-col gap-4">
                                            <div className="skeleton h-4 w-20"></div>
                                            <div className="skeleton h-4 w-28"></div>
                                        </div>
                                    </div>
                                    <div className="   gap-3 p-3 md:p-4 flex items-center">
                                        <div className="  skeleton h-12 w-12 shrink-0 rounded-full"></div>
                                        <div className="flex flex-col gap-4">
                                            <div className="skeleton h-4 w-20"></div>
                                            <div className="skeleton h-4 w-28"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (<div className="overflow-y-auto h-[calc(100vh-250px)] md:h-[calc(100vh-220px)]">


                                {conversation?.map((conversation) => {
                                    const { isGroup, friend, name, avatar, participants } = conversation;
                                    const isOnline = (isGroup && participants.some(participant => onlineUsers.includes(participant._id))) || (!isGroup && onlineUsers.includes(friend?._id));

                                    return (
                                        <div
                                            key={conversation.conversationId}
                                            className="flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-[#E3AADD] border-b border-base-200"
                                            onClick={() => handleConversationSelect(conversation)}
                                        >
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                                        <Avatar
                                                            size={48}
                                                            className="object-cover"
                                                            src={
                                                                (isGroup && avatar?.url)
                                                                    ? avatar.url
                                                                    : (!isGroup && friend?.avatar?.url)
                                                                        ? friend.avatar.url
                                                                        : null // Không có URL sẽ hiển thị icon
                                                            }
                                                            alt={isGroup ? name : friend?.username}
                                                            icon={
                                                                (!(isGroup && avatar?.url) && <MdOutlineGroups3 />) && (!(friend?.avatar?.url) && <CiUser />)
                                                            }
                                                        />


                                                    </div>
                                                </div>

                                                <span
                                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"
                                                        }`}
                                                />
                                            </div>

                                            {/* Thông tin chat */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    {/* Tên người dùng hoặc nhóm */}
                                                    <h3 className="font-semibold text-gray-800 truncate">
                                                        {isGroup ? name : friend?.username}
                                                    </h3>
                                                </div>

                                                {/* Tin nhắn cuối cùng */}
                                                <p
                                                    className="text-sm text-gray-600 truncate max-w-[200px] w-full"
                                                    title={conversation.lastMessage?.content || ""}
                                                >
                                                    {conversation.lastMessage?.sender._id === userinfor?._id
                                                        ? `Bạn: ${conversation.lastMessage?.content || "Hình ảnh"}`
                                                        : `${conversation.lastMessage?.sender.username}: ${conversation.lastMessage?.content || "Hình ảnh"}`}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>)}



                        </div>
                    )}

                    {/* Chat Area */}
                    {(!showFriendsList || !isMobile) && (
                        <div className="flex-1 flex flex-col min-h-0 bg-[#F4E7FB] overflow-hidden">

                            {selectedConservation ? (
                                <>
                                    <div className="p-3 md:p-4 border-b border-base-300 bg-[#F4E7FB] flex-shrink-0">
                                        <div className="flex items-center justify-between gap-3">
                                            {isMobile && (
                                                <button
                                                    onClick={handleBackToList}
                                                    className="btn btn-ghost btn-sm btn-circle"
                                                >
                                                    <i className="bi bi-arrow-left text-lg"></i>
                                                </button>
                                            )}

                                            {/* Avatar */}
                                            <div className="avatar flex-shrink-0">
                                                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full">
                                                    <Avatar size={{
                                                        xs: 24,
                                                        sm: 32,
                                                        md: 40,

                                                    }} alt="Current chat"
                                                        className="object-cover" src={
                                                            selectedConservation.isGroup === true
                                                                ? selectedConservation.avatar?.url
                                                                : selectedConservation.friend.avatar?.url
                                                        } icon={<CiUser />} />

                                                </div>
                                            </div>

                                            {/* Name and Status */}
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-[#2E2E2E]">
                                                    {selectedConservation.isGroup === true
                                                        ? selectedConservation.name
                                                        : selectedConservation.friend.username}
                                                </h3>
                                                <p className="text-xs md:text-sm text-[#595959]">
                                                    {selectedConservation.isGroup === true
                                                        ? selectedConservation.participants.some(participant => onlineUsers.includes(participant._id))
                                                            ? "Đang hoạt động"
                                                            : "Không hoạt động"
                                                        : onlineUsers.includes(selectedConservation.friend._id)
                                                            ? "Đang hoạt động"
                                                            : "Không hoạt động"}
                                                </p>
                                            </div>

                                            {/* Information Icon */}
                                            {selectedConservation.isGroup === true && (
                                                <div className="flex items-center justify-center">
                                                    <IoInformationCircleOutline
                                                        onClick={() => setModalInfor(true)}
                                                        className="text-2xl cursor-pointer transition-all duration-200 ease-in-out transform hover:text-blue-500 hover:scale-110"
                                                    />
                                                    <InforConservation isOpen={modalInfor} onClose={() => setModalInfor(false)} group={selectedConservation} />
                                                </div>
                                            )}

                                        </div>
                                    </div>


                                    <div className="flex-1 flex flex-col min-h-0 relative">
                                        <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-[#F2DDDC]  max-h-full" >
                                            {chats.map((chat) => (
                                                <div
                                                    key={chat._id}
                                                    className={`chat ${chat.sender._id === userinfor._id ? "chat-end" : "chat-start"}`}
                                                >
                                                    {/* Avatar người gửi */}
                                                    <div className="chat-image avatar">
                                                        <Avatar size="large" src={chat.sender.avatar?.url} icon={<CiUser />} />

                                                    </div>



                                                    {/* Nội dung tin nhắn và Popover */}
                                                    {chat.sender._id === userinfor._id ? (
                                                        <Popover
                                                            content={<Content messageId={chat._id} />}
                                                            title="Tùy chọn"
                                                            trigger="click"
                                                        >
                                                            <div className="chat-bubble break-words max-w-[75%] bg-[#4b49c5]">
                                                                {chat.images && chat.images.map((image) => (
                                                                    <img
                                                                        key={image._id}
                                                                        src={image.url}
                                                                        alt="Message attachment"
                                                                        className="max-w-full h-auto rounded-lg mt-2"
                                                                    />
                                                                ))}
                                                                {chat.voices && (
                                                                    <audio src={chat.voices.url} controls autoplay className='h-8 w-44'>
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                )}
                                                                {chat.content}
                                                            </div>
                                                        </Popover>
                                                    ) : (
                                                        <div className="chat-bubble break-words max-w-[75%] bg-[#4b49c5]">
                                                            {chat.images && chat.images.map((image) => (
                                                                <img
                                                                    key={image._id}
                                                                    src={image.url}
                                                                    alt="Message attachment"
                                                                    className="max-w-full h-auto rounded-lg mt-2"
                                                                />
                                                            ))}
                                                            {chat.voices && (
                                                                <div> helofrom the outsite </div>
                                                            )}

                                                            {chat.content}
                                                        </div>
                                                    )}

                                                    {/* Footer tin nhắn */}
                                                    {chat.sender._id === userinfor._id && (
                                                        <div className="chat-footer opacity-50">
                                                            {chat.status === "sent" ? "Đã gửi" : "Đã xem"}
                                                        </div>

                                                    )}


                                                </div>
                                            ))}

                                            <div ref={messageEndRef} />
                                        </div>
                                        {showUpload && (
                                            <div className=" p-4 backdrop-blur-sm bg-[#F2DDDC]/70 rounded-xl border border-[#E3AADD] shadow-md">

                                                <Upload
                                                    beforeUpload={() => false}
                                                    listType="picture-card"
                                                    fileList={fileList}
                                                    onPreview={handlePreview}
                                                    onChange={handleChangeUpload}
                                                    maxCount={3}
                                                    multiple
                                                >
                                                    {fileList.length >= 3 ? null : (
                                                        <div className="flex flex-col items-center justify-center text-[#3C8A8E]">
                                                            <div className="p-3 bg-[#F6BCBA] rounded-full shadow hover:scale-110 transition-transform">
                                                                <i className="bi bi-upload text-2xl"></i>
                                                            </div>
                                                            <div className="mt-2 text-sm font-medium">Tải lên</div>
                                                        </div>
                                                    )}
                                                </Upload>
                                                {previewImage && (
                                                    <Image
                                                        wrapperStyle={{
                                                            display: 'none',
                                                        }}
                                                        preview={{
                                                            visible: previewOpen,
                                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                        }}
                                                        src={previewImage}
                                                    />
                                                )}
                                                <p className="text-sm text-center text-gray-600 mt-2">
                                                    Bạn có thể tải tối đa <span className="font-semibold text-gray-800">3 ảnh</span>.
                                                </p>
                                            </div>

                                        )}
                                        <div className=" bottom-0 bg-[#F2DDDC] border-t border-base-300">
                                            <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-2">

                                                {(!audioBlob && !isRecording) && (

                                                    <button
                                                        onClick={handleClickUpload}
                                                        className="btn btn-ghost btn-sm md:btn-md btn-circle bg-white hover:bg-gray-100"
                                                    >
                                                        <i className="bi bi-paperclip text-lg md:text-xl text-blue-500"></i>
                                                    </button>
                                                )}
                                                <motion.div
                                                    initial={{ x: 0 }}
                                                    animate={{ x: isRecording ? 200 : 0 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                >


                                                    <button
                                                        className="btn btn-ghost btn-sm md:btn-md btn-circle bg-white hover:bg-gray-100 relative"
                                                        onClick={audioBlob ? clearAudio : (isRecording ? stopRecording : startRecording)}
                                                    >
                                                        {isRecording && (
                                                            <div className="absolute inset-0 w-full h-full rounded-full animate-ping bg-red-500/30" />
                                                        )}
                                                        {audioBlob ? (
                                                            <FaTrash className='text-red-700 text-lg ' />
                                                        ) : (<i className={`bi bi-mic text-lg md:text-xl ${isRecording ? 'text-red-500' : 'text-blue-500'}`} />)}

                                                    </button>
                                                </motion.div>
                                                {/* Phát lại và upload */}
                                                {audioBlob && (
                                                    <div className="mt-4 flex-1 relative items-center">
                                                        <audio controls className="mb-4 h-10 w-full">
                                                            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                                                        </audio>
                                                    </div>
                                                )}

                                                {/* Hiển thị InputEmoji chỉ khi không có audioBlob */}
                                                {(!audioBlob && !isRecording) && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.5 }}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <div className="flex-1 relative max-w-[320px]">
                                                            <div className="max-h-[100px]">
                                                                <InputEmoji
                                                                    value={newMessage}
                                                                    maxLength={255}
                                                                    onChange={setNewMessage}
                                                                    cleanOnEnter
                                                                    placeholder="Nhập tin nhắn của bạn"
                                                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                {!isRecording && (
                                                    <button
                                                        className="btn btn-circle bg-blue-500 hover:bg-blue-600 text-white btn-sm md:btn-md "
                                                        onClick={sendMessage}

                                                        disabled={isSending}
                                                    >

                                                        {isSending ? <span className="loading loading-infinity loading-lg"></span> : <i className="bi bi-send-fill"></i>}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-[#595959]">
                                        Hãy chọn một cuộc trò chuyện để bắt đầu
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>


    );
};

export default Message;