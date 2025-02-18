import React from 'react';
import HeaderUser from '../header/HeaderUser';
import Sidebar from '../sidebar/Sidebar';
import { useMediaQuery } from 'react-responsive';



const LayoutUser = ({ children }) => {





    return (

        <div className="min-h-screen bg-gray-100 relative">

            <HeaderUser className="fixed top-0 w-full z-50 bg-white shadow-sm" />

            <div className="pt-16">
                <div className="container mx-auto flex gap-4">

                    <div className="hidden 2xl:block w-1/5 fixed left-0 top-16 z-40 ">
                        <Sidebar />
                    </div>


                    <main className="w-full md:w-4/5  mx-auto flex justify-center px-10 items-center ">
                        {children}
                    </main>
                </div>
            </div>
        </div>

    );
}

export default LayoutUser;
