import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userprofile, refreshtoken, listUser } from '../../redux/Auth/Auth.thunk'
import Loading from '../loading/loading'
import { useNavigate } from 'react-router-dom';
import { SocketProvider } from '../../socket/SocketContext'
const AuthWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isAuthenticated, userinfor } = useSelector((state) => state.auth);
    const [isInitialized, setIsInitialized] = useState(false);

    const initAuthUser = async () => {
        try {
            if (!isAuthenticated || !userinfor) {
                await dispatch(userprofile()).unwrap();
                await dispatch(listUser()).unwrap();
            }
        } catch (error) {
            if (error?.response?.status === 401) {

                navigate("/");
            }
        } finally {
            setIsInitialized(true);
        }
    };

    useEffect(() => {

        if (!isInitialized) {
            initAuthUser();
        }

    }, [isInitialized]);
    if (!isInitialized) {
        return <div><Loading /></div>;
    }
    return isAuthenticated ? (
        <SocketProvider>{children}</SocketProvider>
    ) : (
        children
    );
}

export default AuthWrapper;