import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { userdetail } from '../../redux/User/User.thunk';
import { UserPlus, Heart, UserX, Check } from 'lucide-react';
import { addFriend, updateFriend, deleteFriend } from '../../redux/FriendShip/FriendShip.thunk';
import { allfriendship } from '../../redux/FriendShip/FriendShip.thunk';
import { allPostGues } from '../../redux/Post/Post.thunk';
import { removeFriend } from '../../redux/Auth/Auth.slice';
import { userprofile } from '../../redux/Auth/Auth.thunk';
import PostList from '../../components/Post/PostList';
import { Avatar } from 'antd';
import { motion } from "framer-motion";
import { UserOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons';
import { listfriend } from '../../redux/FriendShip/FriendShip.thunk';
import ListFriend from '../../components/friends/ListFriend';
import { message } from 'antd';
const DetailUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detailUser = useSelector((state) => state.userdetail.detailUser)
  const loading = useSelector((state) => state.userdetail.loading)
  const userinfor = useSelector((state) => state.auth.userinfor)
  const receivedRequests = useSelector((state) => state.friendship.receivedRequests)
  const sentRequests = useSelector((state) => state.friendship.sentRequests)
  const allpost = useSelector((state) => state.post.allpost)
  const friends = useSelector((state) => state.friendship.friends)
  const [showlistfriend, setShowListFriend] = useState(false)
  useEffect(() => {
    dispatch(userdetail({ id }))
    dispatch(userprofile())
    dispatch(allfriendship({ id: userinfor._id }));
  }, [])
  useEffect(() => {


    dispatch(allPostGues({ id: userinfor._id, userid: id }));
  }, [dispatch]);
  useEffect(() => {

    dispatch(listfriend({ id: id }))

  }, [id]);

  const handleAddFriend = async () => {
    const data = {
      requesterId: userinfor._id,
      receiverId: id
    }
    const res = await dispatch(addFriend({ data })).unwrap();

    if (res.success) {
      dispatch(allfriendship({ id: userinfor._id }));
    }


  }

  const handleDeleteFriend = async () => {

    const data = {
      userId: userinfor._id,
      friendId: id
    }
    const res = await dispatch(deleteFriend({ data })).unwrap();
    dispatch(removeFriend(id));



  }

  const handleAcceptFriend = () => {
    const data = {
      requesterId: id,
      receiverId: userinfor._id,
      status: "accepted"
    }
    dispatch(updateFriend({ data }))
    dispatch(allfriendship({ id: userinfor._id }));
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  const handleRejectFriend = () => {
    const data = {
      requesterId: id,
      receiverId: userinfor._id,
      status: "rejected"
    }
    console.log("reject: ", data)
  }
  const handleshowpost = () => {
    setShowListFriend(false)
  }
  const handleshowfriend = () => {
    setShowListFriend(true)
  }
  const renderFriendButton = () => {
    const receivedRequest = receivedRequests.find(
      (request) => request.requesterId._id === id
    );

    const sentRequest = sentRequests.find(
      (request) => request.receiverId === id
    );

    const isfriend = userinfor.friends.includes(id);

    if (isfriend) {
      return (
        <button
          className="btn bg-gray-500 text-white btn-sm md:btn-md flex items-center gap-2"
          onClick={handleDeleteFriend}
        >
          <UserX size={16} />
          Hủy kết bạn
        </button>
      );
    }
    if (receivedRequest) {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleAcceptFriend}
            className="btn bg-gradient-to-r from-green-500 to-emerald-500 text-white btn-sm md:btn-md flex items-center gap-2"
          >
            <Check size={16} />
            Chấp nhận
          </button>
          <button
            onClick={handleRejectFriend}
            className="btn bg-gradient-to-r from-red-500 to-pink-500 text-white btn-sm md:btn-md flex items-center gap-2"
          >
            <UserX size={16} />
            Từ chối
          </button>
        </div>
      );
    }

    if (sentRequest) {
      return (
        <button
          className="btn bg-gray-500 text-white btn-sm md:btn-md flex items-center gap-2"
          onClick={handleAddFriend}
        >
          <UserX size={16} />
          Hủy lời mời
        </button>
      );
    }

    return (
      <button
        className="btn bg-gradient-to-r from-cyan-500 to-blue-500 text-white btn-sm md:btn-md flex items-center gap-2"
        onClick={handleAddFriend}
      >
        <UserPlus size={16} />
        Kết bạn
      </button>
    );
  };


  if (loading) {
    return (
      <div className="w-full justify-center max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-4">
        <div className="w-full p-2 md:p-5 border border-gray-300 rounded-lg shadow-xl bg-white">
          {/* Skeleton Cover Photo */}
          <figure className="relative h-32 md:h-48 bg-white">
            <div className="skeleton w-full h-full rounded-t-lg  bg-[#97A1F0]"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-white bg-opacity-80">
              {/* Skeleton Avatar */}
              <div className="skeleton w-16 md:w-24 h-16 md:h-24 rounded-full bg-[#97A1F0]"></div>

              {/* Skeleton User Info */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="skeleton  h-4 w-32 mb-2  bg-[#97A1F0]"></div>
                  <div className="skeleton h-3 w-24  bg-[#97A1F0]"></div>
                </div>

                {/* Skeleton Buttons */}
                <div className="flex gap-2">
                  <div className="skeleton w-24 h-8  bg-[#97A1F0]"></div>
                  <div className="skeleton w-24 h-8  bg-[#97A1F0]"></div>
                </div>
              </div>
            </div>
          </figure>

          {/* Skeleton Content */}
          <div className="card-body p-3 md:p-6 bg-white">
            <div className="skeleton h-3 w-20 mb-2  bg-[#97A1F0]"></div>
            <div className="skeleton h-4 w-full mb-4  bg-[#97A1F0]"></div>

            <div className="divider my-1"></div>

            {/* Skeleton Menu */}
            <div className="flex justify-center md:justify-start gap-4">
              <div className="skeleton h-4 w-16  bg-[#97A1F0]"></div>
              <div className="skeleton h-4 w-16  bg-[#97A1F0]"></div>
              <div className="skeleton h-4 w-16  bg-[#97A1F0]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full justify-center max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-4">
      <div className="w-full p-6 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] hover:shadow-xl transition-shadow duration-300">
        {/* Avatar và thông tin người dùng */}
        <div className="flex flex-col items-center">
          <Avatar
            size={120}
            src={detailUser?.avatar?.url || "https://avatar.iran.liara.run/public/4"}
            icon={<UserOutlined />}
            className="border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">
            {detailUser?.username}
          </h2>
          <p className="text-sm text-gray-600 flex items-center">
            <MailOutlined className="mr-2" /> {detailUser?.email}
          </p>
          <div className="mt-4">
            {renderFriendButton()}
          </div>
        </div>

        {/* Tiểu sử */}
        <div className="mt-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-3">Tiểu sử</h1>
          <p className="text-sm text-gray-700 mb-4">
            {detailUser?.bio || "Chưa có tiểu sử."}
          </p>
        </div>

        {/* Line separator */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Menu */}
        <ul className="flex justify-center md:justify-start gap-8">
          <li>
            <a className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center" onClick={handleshowpost}>
              <LinkOutlined className="mr-2" /> Bài viết
            </a>
          </li>
          <li>
            <a className="text-sm md:text-base text-gray-800 hover:text-blue-500 transition duration-300 flex items-center" onClick={handleshowfriend}>
              <LinkOutlined className="mr-2" /> Bạn bè
            </a>
          </li>

        </ul>
      </div>

      <div className="divider my-1 md:my-2"></div>
      {showlistfriend ? (<motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <ListFriend listfriend={friends} />
      </motion.div>) : (<motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <PostList allpost={allpost} />
      </motion.div>)}
    </div>
  )
}

export default DetailUser