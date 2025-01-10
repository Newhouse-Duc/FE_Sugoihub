import React, { lazy, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Loading from "../components/loading/loading";

const Message = lazy(() => import('../pages/Messages/Message'))
const LayoutUser = lazy(() => import('../components/layout/LayoutUser'))
const Setting = lazy(() => import('../pages/Setting'))
const Pagetitle = lazy(() => import('../components/layout/Pagetitle'))
const Account = lazy(() => import('../pages/Account/Account'))
const Auth = lazy(() => import('../pages/Auth/Auth'));
const Home = lazy(() => import('../pages/Home/Home'));
const FriendRequest = lazy(() => import('../pages/FriendRequest/FriendRequest'))
const DetailUser = lazy(() => import("../pages/DetailUser/DetailUser"))


const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, userinfor } = useSelector((state) => state.auth);
    const location = useLocation();


    if (!isAuthenticated) return <Navigate to="/" state={{ from: location.pathname }} replace />;

    return children;
};

const PublicRoute = ({ children }) => {
    const { isLoading, userinfor } = useSelector((state) => state.auth);

    return userinfor ? (
        <Navigate to="/home" replace />
    ) : (
        children
    );
};

const LazyLoadComponent = ({ Component, title }) => (


    <Pagetitle title={title}>
        <Component />
    </Pagetitle>


);

const routes = [
    {
        path: '/',
        element: (
            <PublicRoute>
                <LazyLoadComponent Component={Auth} title="SugoiHub" />
            </PublicRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/account',
        element: (
            <ProtectedRoute>
                <LayoutUser>
                    <LazyLoadComponent Component={Account} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/home',
        element: (
            <ProtectedRoute>
                <LayoutUser >
                    <LazyLoadComponent Component={Home} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/setting',
        element: (
            <ProtectedRoute>
                <LayoutUser >
                    <LazyLoadComponent Component={Setting} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/messages',
        element: (
            <ProtectedRoute>
                <LayoutUser>
                    <LazyLoadComponent Component={Message} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/friendrequest',
        element: (
            <ProtectedRoute>
                <LayoutUser>
                    <LazyLoadComponent Component={FriendRequest} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/user/:id',
        element: (
            <ProtectedRoute>
                <LayoutUser>
                    <LazyLoadComponent Component={DetailUser} title="SugoiHub" />
                </LayoutUser>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
];

export const homeRoutes = routes.map(({ path, element, title }) => ({
    path,
    element,
    title
}));
