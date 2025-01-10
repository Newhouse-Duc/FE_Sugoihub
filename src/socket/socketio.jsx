import { io } from "socket.io-client";


const socketcf = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    autoConnect: false,
});

export default socketcf;