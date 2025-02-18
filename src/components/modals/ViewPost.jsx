import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, message, Upload, Image, Input, Avatar, Carousel } from 'antd';
import { allCommentByPost, likeComment } from '../../redux/Comment/Comment.thunk';
import ActionPost from '../Post/ActionPost';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Parallax, FreeMode, EffectFade } from 'swiper/modules';
import ReplyComment from './ReplyComment';
import { formatDistance } from 'date-fns';
import { getReplyComment } from '../../redux/Comment/Comment.thunk';

import { vi } from 'date-fns/locale';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import LazyNestedComments from '../NestedComments/LazyNestedComments';

const ViewPost = ({ isOpen, onClose, post, onCommentClick }) => {
    const dispatch = useDispatch()
    const userinfor = useSelector((state) => state.auth.userinfor)
    const videoRef = useRef(null);
    const replyComment = useSelector((state) => state.comment.replyComment)
    const [modalreply, setModalReply] = useState(false)
    const [reply, setReply] = useState(null)
    const comment = useSelector((state) => state.comment.comment)
    const [loading, setloading] = useState(false)
    const formatDate = (date) => {
        return formatDistance(new Date(date), new Date(), {
            addSuffix: true,
            locale: vi
        });
    };
    const fetchcomment = async (postId) => {
        setloading(true);
        try {
            await dispatch(allCommentByPost({ id: postId })).unwrap();
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setloading(false);
        }
    };
    useEffect(() => {
        if (post && post._id) {
            fetchcomment(post._id);
        }
    }, [post]);
    const stopVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleReplyComment = (comment) => {
        setReply(comment);
        setModalReply(true)
    }
    const handleViewReplyComment = async (comment) => {


        dispatch(getReplyComment({ id: comment }))
    }
    const handleLikeComment = async (comment) => {
        try {
            if (!comment?._id || !userinfor?._id) {
                message.error("Thiếu id bài viết hoặc id người dùng");
                return;
            }

            const data = {
                userId: userinfor._id,
                commentId: comment._id
            };

            const res = await dispatch(likeComment({ data })).unwrap();
            if (res.success && res.data.isLiked) {
                message.success("Thích bình luận thành công");
            }

        } catch (error) {
            message.error('Lỗi like comment: ' + error.message);
        }
    };
    useEffect(() => {
        if (!isOpen) {
            stopVideo();
        }
    }, [isOpen]);


    return (
        <>


            <Modal
                title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-lg font-semibold">Bài viết</span>
                    </div>
                }

                getContainer={false}
                open={isOpen}
                onCancel={() => onClose()}
                maskClosable={false}
                width={800}
                className="viewpost-modal  z-[1000] fixed inset-0 m-auto px-4 max-h-[90vh] !mt-[10vh]"
                footer={null}
            >
                <div className='max-h-[calc(80vh-80px)] overflow-auto'>

                    <div className="flex gap-4 mt-4 items-start">
                        <Avatar
                            src={post?.user?.avatar?.url || "https://avatar.iran.liara.run/public/4"}
                            size={50}
                            className="flex-shrink-0 shadow"
                        />
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">{post?.user?.username}</h3>
                            <div className="flex items-center text-sm text-gray-500 gap-3">
                                <p>  {post && formatDate(post?.createdAt)}</p>
                                {post?.visibility === "public" && (
                                    <i className="bi bi-globe-asia-australia text-gray-500" title="Public"></i>
                                )}
                                {post?.visibility === "friends" && (
                                    <i className="bi bi-people-fill text-gray-500" title="Friend"></i>
                                )}
                                {post?.visibility === "private" && (
                                    <i className="bi bi-lock-fill text-gray-500" title="Private"></i>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="mt-4">
                        <p className="text-gray-800 mb-4">{post?.content}</p>
                        <Swiper
                            modules={[Navigation, Pagination, Parallax, FreeMode, EffectFade]}
                            effect="slide"
                            speed={500}
                            freeMode={true}
                            spaceBetween={10}
                            slidesPerView={2}
                            centeredSlides={true}
                            initialSlide={0}
                            slideToClickedSlide={false}
                            pagination={{ clickable: true }}


                        >
                            <div
                                slot="container-start"
                                className="parallax-bg "
                                data-swiper-parallax="-23%"

                            ></div>
                            {post?.images?.map((image, index) => (
                                <SwiperSlide key={`image-${index}`}>
                                    <div className="title w-auto h-auto mx-auto " data-swiper-parallax="-300">
                                        <Image
                                            src={image.url}
                                            alt={`Slide ${index}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                margin: '0 auto',
                                                borderRadius: '8px',


                                            }}
                                            className="object-cover aspect-square"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                            {post?.videos?.map((video, index) => (
                                <SwiperSlide key={`video-${index}`}>
                                    <div className="title w-auto h-auto mx-auto" data-swiper-parallax="-300">
                                        <video
                                            ref={videoRef}
                                            controls
                                            style={{
                                                width: '100%',

                                                height: '100%',

                                            }}
                                            className=" aspect-square"
                                        >
                                            <source src={video.url} type="video/mp4" />

                                        </video>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <ActionPost post={post} onCommentClick={onCommentClick} />


                    <div className="divider "></div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        SugoiHub Bình luận

                    </h3>

                    <div className="h-px bg-gray-200 w-full my-4" />

                    {loading ? (
                        <div className="flex w-52 flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                                <div className="flex flex-col gap-4">
                                    <div className="skeleton h-4 w-20"></div>
                                    <div className="skeleton h-4 w-28"></div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div>
                            <div className="space-y-4">
                                {comment?.length > 0 ? (
                                    <LazyNestedComments
                                        comments={comment}
                                        replyComments={replyComment}
                                        onLoadReplies={handleViewReplyComment}
                                        onReply={handleReplyComment}
                                        onLike={handleLikeComment}
                                    />
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                                    </div>
                                )}
                            </div>

                            <ReplyComment
                                isOpen={modalreply}
                                onClose={() => setModalReply(false)}
                                comment={reply} />
                            <div className="mt-4">
                                <div className="divider "></div>
                            </div>
                        </div>
                    )}

                </div>

            </Modal>




        </>
    )
}

export default ViewPost