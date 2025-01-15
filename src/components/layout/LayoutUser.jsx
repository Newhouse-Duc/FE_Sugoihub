import React from 'react';
import HeaderUser from '../header/HeaderUser';
import Sidebar from '../sidebar/Sidebar';
import { useMediaQuery } from 'react-responsive';
import Rightbar from '../rightbar/Rightbar';


const LayoutUser = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 780 });



    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Header cố định ở trên cùng */}
            <HeaderUser className="fixed top-0 w-full z-50 bg-white shadow-sm" />

            <div className="pt-16">
                <div className="container mx-auto w-full flex gap-4">
                    {/* Sidebar bên trái */}
                    {!isMobile && (
                        <div className="w-10 fixed left-0 top-16 hidden md:block">
                            <Sidebar />
                        </div>
                    )}

                    {/* Main content */}
                    <main className={`flex-1 w-4/5 ${!isMobile ? 'md:mx-4  lg:px-9 lg:mx-32' : 'mx-2'}  justify-center items-center`}>
                        {children}
                    </main>

                    {/* Rightbar bên phải */}
                    {!isMobile && (
                        <div className="w-52 fixed right-0 top-16 hidden  md:block ">
                            <Rightbar />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LayoutUser;
