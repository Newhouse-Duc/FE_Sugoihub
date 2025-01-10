import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { userdetail } from '../../redux/User/User.thunk';
import { UserPlus, Heart, UserX, Check } from 'lucide-react';
import { addFriend, updateFriend } from '../../redux/FriendShip/FriendShip.thunk';
import { allfriendship } from '../../redux/FriendShip/FriendShip.thunk';
import { allPostGues } from '../../redux/Post/Post.thunk';

import PostList from '../../components/Post/PostList';
const DetailUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detailUser = useSelector((state) => state.userdetail.detailUser)
  const loading = useSelector((state) => state.userdetail.loading)
  const userinfor = useSelector((state) => state.auth.userinfor)
  const receivedRequests = useSelector((state) => state.friendship.receivedRequests)
  const sentRequests = useSelector((state) => state.friendship.sentRequests)
  const allpost = useSelector((state) => state.post.allpost)

  useEffect(() => {

    dispatch(allfriendship({ id: userinfor._id }));
    dispatch(allPostGues({ id: userinfor._id, userid: id }));
  }, [dispatch, userinfor, receivedRequests, sentRequests]);
  useEffect(() => {
    dispatch(userdetail({ id }))
  }, [id])

  const handleAddFriend = () => {
    const data = {
      requesterId: userinfor._id,
      receiverId: id
    }
    dispatch(addFriend({ data }))
    dispatch(allfriendship({ id }));
  }

  const handleAcceptFriend = () => {
    const data = {
      requesterId: id,
      receiverId: userinfor._id,
      status: "accepted"
    }
    dispatch(updateFriend({ data }))
  }

  const handleRejectFriend = () => {
    const data = {
      requesterId: id,
      receiverId: userinfor._id,
      status: "rejected"
    }
    console.log("reject: ", data)
  }

  const renderFriendButton = () => {
    // Kiểm tra nếu người dùng hiện tại nhận được lời mời kết bạn từ người dùng đang xem
    const receivedRequest = receivedRequests.find(
      request => request.requesterId._id === id
    )

    // Kiểm tra nếu người dùng hiện tại đã gửi lời mời kết bạn cho người dùng đang xem
    const sentRequest = sentRequests.find(
      request => request.receiverId === id
    )

    const isfriend = userinfor.friends.includes(id);
    if (isfriend) {
      return (
        <button
          className="btn bg-gray-500 text-white btn-sm md:btn-md flex items-center gap-2"

        >
          <UserX size={16} />
          hủy kết bạn
        </button>
      )
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
      )
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
      )
    }

    return (
      <button
        className="btn bg-gradient-to-r from-cyan-500 to-blue-500 text-white btn-sm md:btn-md flex items-center gap-2"
        onClick={handleAddFriend}
      >
        <UserPlus size={16} />
        Kết bạn
      </button>
    )
  }

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
      <div className="w-full p-2 md:p-5 border border-gray-300 rounded-lg shadow-xl bg-white">
        <figure className="relative h-32 md:h-48">
          <img
            className="w-full h-full object-cover rounded-t-lg"
            alt="Background Image"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-16 md:w-24 rounded-full ring ring-offset-2">
                <img className="object-cover" alt="Ảnh đại diện" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-lg md:text-xl font-bold mt-2">{detailUser?.username}</h2>
                <p className="text-gray-300 text-sm md:text-base">Software Engineer</p>
              </div>

              <div className="flex gap-2">
                {renderFriendButton()}
                <button className="btn btn-outline btn-sm md:btn-md flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 border-2 border-pink-500 text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-lg">
                  <Heart size={16} />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </figure>

        {/* Rest of the component remains the same */}
        <div className="card-body p-3 md:p-6">
          <h1 className='text-xs md:text-sm text-black'>Tiểu sử</h1>
          <p className='text-sm md:text-base text-black'>
            Hi, I'm John Doe, a passionate software engineer. I enjoy building innovative solutions that solve real-world problems.
          </p>

          <div className="divider my-1"></div>

          <ul className="menu menu-horizontal w-full justify-center md:justify-start gap-2 md:gap-4 rounded-box">
            <li className="text-sm md:text-base"><a>Bài viết</a></li>
            <li className="text-sm md:text-base"><a>Bạn bè</a></li>
            <li className="text-sm md:text-base"><a>Giới thiệu</a></li>
          </ul>
        </div>
      </div>

      <div className="divider my-1 md:my-2"></div>
      <PostList allpost={allpost} />
    </div>
  )
}

export default DetailUser