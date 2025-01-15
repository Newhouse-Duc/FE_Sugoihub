export const getMessageContent = (message) => {
    if (message.content) return message.content;
    if (message.images.length > 0) return "Hình ảnh";
    if (message.voices) return "Tin nhắn thoại";
    if (message.videos.length > 0) return "Video";
    return "";
};