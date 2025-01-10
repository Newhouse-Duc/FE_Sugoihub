import React, { useEffect } from 'react';
import { useSocket } from '../../../socket/SocketContext';
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { BsFileEarmarkRichtextFill } from "react-icons/bs";
import { MdReportGmailerrorred } from "react-icons/md";
import Chart from 'react-apexcharts';

const Home = () => {
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        console.log("Xem online ", onlineUsers);
    }, [onlineUsers]);

    const lineChartData = {
        series: [
            {
                name: "Doanh số",
                data: [10, 41, 35, 51, 49, 62, 69],
            },
        ],
        options: {
            chart: { type: 'line', height: 350 },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
        },
    };

    const donutChartData = {
        series: [44, 55, 13, 33],
        options: {
            chart: { type: 'donut' },
            labels: ['Red', 'Blue', 'Yellow', 'Green'],
        },
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-4">Dashboard</p>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Tổng số người dùng"
                    subtitle="100 người dùng"
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
                    subtitle="5678 bài viết"
                    Icon={BsFileEarmarkRichtextFill}
                >
                    <div className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 flex items-center">Bài viết mới ngày hôm nay </div>
                </DashboardCard>
                <DashboardCard
                    title="Báo cáo vi phạm"
                    subtitle="10 báo cáo chưa xử lí "
                    Icon={MdReportGmailerrorred}
                />
            </div>

            <div className="mt-8">
                <p className="text-xl font-semibold mb-4">Biểu đồ đường</p>
                <div className="bg-white p-4 rounded-lg shadow">
                    <Chart options={lineChartData.options} series={lineChartData.series} type="line" height={350} />
                </div>
                <div>bài viết tương tác nhiều nhất </div>
            </div>

            <div className="mt-8">
                <p className="text-xl font-semibold mb-4">Biểu đồ Đồng Hồ</p>
                <div className="bg-white p-4 rounded-lg shadow">
                    <Chart options={donutChartData.options} series={donutChartData.series} type="donut" height={350} />
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
