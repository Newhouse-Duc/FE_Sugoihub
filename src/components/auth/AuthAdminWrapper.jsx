import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adminprofile } from '../../redux/Auth/Auth.thunk'
import Loading from '../loading/loading'
import { useNavigate } from 'react-router-dom';
import { SocketProvider } from '../../socket/SocketContext'
const AuthAdminWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAdminAuthenticated, admininfor } = useSelector((state) => state.auth);
    const [isInitialized, setIsInitialized] = useState(false);

    const initAuthAdmin = async () => {
        try {
            if (!isAdminAuthenticated || !admininfor) {
                await dispatch(adminprofile()).unwrap();
            }
        } catch (error) {
            console.error("Lỗi xác thực admin:", error);
            navigate("/admin");
        } finally {
            setIsInitialized(true);
        }
    };

    useEffect(() => {
        if (!isInitialized) {
            initAuthAdmin();
        }
    }, [isInitialized]);

    if (!isInitialized) {
        return <Loading />;
    }
    return isAdminAuthenticated ? (
        <SocketProvider>{children}</SocketProvider>
    ) : (
        children
    );
};

export default AuthAdminWrapper;


