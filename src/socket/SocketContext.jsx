import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import socketcf from "./socketio";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, isAdminAuthenticated, userinfor, admininfor } = useSelector((state) => state.auth);
    const [onlineUsers, setOnlineUsers] = useState([]); // Quản lý danh sách online

    useEffect(() => {
        if ((isAuthenticated || isAdminAuthenticated) && !socketcf.connected) {
            socketcf.connect();

            socketcf.on("connect", () => {
                console.log("Connected to socket-id:", socketcf.id);
                if (userinfor) {
                    socketcf.emit("userOnline", { userId: userinfor._id, role: "user" });
                }
                if (admininfor) {
                    socketcf.emit("userOnline", { userId: admininfor._id, role: "admin" });
                }
            });

            socketcf.on("updateOnlineUsers", (users) => {
                console.log("Online users from server:", users);
                setOnlineUsers(users);
            });

            socketcf.on("disconnect", () => {
                console.log("Disconnected from socket");
            });

            return () => {
                socketcf.off("updateOnlineUsers"); // Gỡ sự kiện
                socketcf.off("disconnect");
                if (socketcf.connected) {
                    socketcf.disconnect();
                }
            };
        }
    }, [isAuthenticated, isAdminAuthenticated, userinfor, admininfor]);

    const value = useMemo(() => ({ socket: socketcf, onlineUsers }), [onlineUsers]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
