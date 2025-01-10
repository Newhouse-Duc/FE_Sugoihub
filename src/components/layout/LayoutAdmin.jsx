import React, { useState } from 'react'
import RightbarAdmin from '../rightbar/RightbarAdmin'
const LayoutAdmin = ({ children }) => {
    const [selected, setSelected] = useState("Trang chủ");
    const [open, setOpen] = useState(true);
    return (
        <>
            <div className="flex bg-indigo-50 h-screen overflow-hidden">
                <RightbarAdmin open={open} setOpen={setOpen} />
                <main className="h-full w-full p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </>
    )
}

export default LayoutAdmin