import React, { useEffect, useMemo } from 'react';
import { useSocket } from '../../../socket/SocketContext';
import { Avatar } from "antd";
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { BsFileEarmarkRichtextFill } from "react-icons/bs";
import { MdReportGmailerrorred } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getdata } from '../../../redux/Admin/Admin_dashboard/Admin_dashboard.thunk';
import { getAllUser, getDataPost } from '../../../redux/Admin/Admin_dashboard/Admin_dashboard.thunk';
import Chart from 'react-apexcharts';

const Home = () => {
    const { socket, onlineUsers } = useSocket();
    const dispatch = useDispatch()
    useEffect(() => {
        console.log("Xem online ", onlineUsers);
    }, [onlineUsers]);
    const analyticsdata = useSelector((state) => state.admindashboard.analyticsdata)
    const AllUser = useSelector((state) => state.admindashboard.AllUser)
    const dataPost = useSelector((state) => state.admindashboard.dataPost)
    const statistics = useMemo(() => {
        const totalUsers = AllUser.length;
        const activeUsers = AllUser.filter(user => user.isActive).length;
        const bannedUsers = AllUser.filter(user => user.ban).length;
        const inactiveUsers = totalUsers - activeUsers;

        return {
            total: totalUsers,
            active: activeUsers,
            banned: bannedUsers,
            inactive: inactiveUsers
        };
    }, [AllUser]);

    useEffect(() => {
        dispatch(getDataPost())
        dispatch(getdata())
        dispatch(getAllUser())
    }, [])

    useEffect(() => {
        console.log("dau rồi : ", dataPost?.topPosts.author)
    }, [dataPost])

    const donutChartData = {
        options: {
            chart: {
                type: 'donut',

            },
            labels: ['Đã xác thực', 'Chưa xác thực', 'Bị cấm'],
            colors: ['#4CAF50', '#FFC107', '#F44336'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Tổng người dùng',
                                formatter: () => statistics.total
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return Math.round(val) + '%';
                }
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        return value + " người dùng";
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
        series: [statistics.active, statistics.inactive, statistics.banned]
    };

    // Thống kê theo tháng
    const monthlyData = useMemo(() => {
        const months = {};
        AllUser.forEach(user => {
            const date = new Date(user.createdAt);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            months[monthYear] = (months[monthYear] || 0) + 1;
        });

        return {
            categories: Object.keys(months),
            data: Object.values(months)
        };
    }, [AllUser]);

    const lineChartData = {
        options: {
            chart: {
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            xaxis: {
                categories: monthlyData.categories
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            title: {
                text: 'Người dùng đăng ký theo tháng',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            markers: {
                size: 6
            }
        },
        series: [{
            name: "Người dùng mới",
            data: monthlyData.data
        }]
    };

    if (!dataPost) {
        return <p>Loading data...</p>;
    }





    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-4">Dashboard</p>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Tổng số người dùng"
                    subtitle={`${analyticsdata?.activeUsers} người dùng`}
                    Icon={FiUsers}
                    href="#"
                >
                    <div className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 flex items-center">
                        <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                        Đang hoạt động: <span className="ml-1 text-green-500">{onlineUsers.length}</span>
                    </div>
                </DashboardCard>

                <DashboardCard
                    title="Tổng số bài viết"
                    subtitle={`${analyticsdata?.countPosts} bài viết`}
                    Icon={BsFileEarmarkRichtextFill}
                >
                    <div className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 flex items-center">Số bài viết mới ngày hôm nay {analyticsdata.countPostsToday}</div>
                </DashboardCard>

            </div>
            <h1 className='text-xl font-bold mt-3'>Thống kê tài khoản người dùng</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">

                <div className="col-span-1 md:col-span-3 bg-white  shadow-2xl  card glass">
                    <div className="card-body">
                        <Chart
                            options={lineChartData.options}
                            series={lineChartData.series}
                            type="line"
                            height={350}
                        />
                    </div>  </div>

                <div className="col-span-1 md:col-span-2 bg-white  shadow-2xl  card glass ">
                    <div className="card-body">
                        <Chart
                            options={donutChartData.options}
                            series={donutChartData.series}
                            type="donut"
                            height={350}
                        />
                    </div>
                </div>
            </div>
            <h1 className='text-xl font-bold mt-3'>Thống kê bài viết </h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                <div className="col-span-1 md:col-span-3 bg-white shadow-2xl rounded-lg p-6 card glass">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i className="bi bi-bar-chart-fill text-blue-500 mr-2"></i> Thông số tương tác
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600 flex items-center">
                                <i className="bi bi-hand-thumbs-up-fill text-green-500 mr-2"></i> Trung bình lượt thích:
                            </span>
                            <span className="font-medium text-gray-800">{dataPost?.stats?.avgLikes}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600 flex items-center">
                                <i className="bi bi-chat-dots-fill text-indigo-500 mr-2"></i> Trung bình bình luận:
                            </span>
                            <span className="font-medium text-gray-800">{dataPost?.stats?.avgComments}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600 flex items-center">
                                <i className="bi bi-hand-thumbs-up text-yellow-500 mr-2"></i> Tổng lượt thích:
                            </span>
                            <span className="font-medium text-gray-800">{dataPost?.stats?.totalLikes}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center">
                                <i className="bi bi-chat-dots text-red-500 mr-2"></i> Tổng bình luận:
                            </span>
                            <span className="font-medium text-gray-800">{dataPost?.stats?.totalComments}</span>
                        </div>
                    </div>
                </div>



                <div className="col-span-1 md:col-span-2 bg-white shadow-2xl rounded-lg p-6">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết tương tác nhiều nhất</h2>

                        <div className="space-y-6">
                            {/* User info section */}
                            <div className="flex items-center space-x-4">
                                <Avatar
                                    src={dataPost?.topPosts.author.avatar?.url}
                                    icon={<FiUser />}
                                    className="w-12 h-12 ring-2 ring-gray-100"
                                />
                                <div>
                                    <h1 className="text-gray-900 font-semibold">
                                        {dataPost?.topPosts.author?.username}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {new Date(dataPost?.topPosts.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Content section */}
                            <p className="text-gray-700">
                                {dataPost?.topPosts.content}
                            </p>

                            {/* Images section */}
                            <div className="flex justify-center gap-4 overflow-x-auto py-3">
                                {dataPost?.topPosts?.images?.map((image) => (
                                    <div
                                        key={image._id}
                                        className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={image.url}
                                            alt="Post content"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center space-x-6 text-gray-600 pt-2 border-t">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Tổng tương tác:</span>
                                    <span className="font-medium">{dataPost?.topPosts.totalInteractions}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Lượt thích:</span>
                                    <i className="bi bi-heart-pulse text-red-500"></i>
                                    <span className="font-medium">{dataPost?.topPosts.likesCount}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Lượt bình luận:</span>
                                    <i className="bi bi-chat-dots text-blue-600"></i>
                                    <span className="font-medium">{dataPost?.topPosts.commentsCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, subtitle, Icon, href, children }) => {
    return (
        <a
            href={href}
            className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
            <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
            <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
            <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
                {title}
            </h3>
            <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
                {subtitle}
            </p>
            <div className="relative z-10 mt-2">
                {children}
            </div>
        </a>
    );
};

export default Home;
