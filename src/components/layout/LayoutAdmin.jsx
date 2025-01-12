import React, { useState } from 'react'

import SideNavAdmin from '../sidebar/SideNavAdmin';
const LayoutAdmin = ({ children }) => {

    return (
        <>
            <div className="flex bg-indigo-50 h-screen overflow-hidden">

                <SideNavAdmin />

                <main className="h-full w-full p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </>
    )
}

export default LayoutAdmin