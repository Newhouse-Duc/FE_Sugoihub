import React, { lazy, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from '../components/loading/loading';
import { useSelector } from 'react-redux';


const AuthAdmin = lazy(() => import('../pages/Admin/AuthAdmin'))
const LayoutAdmin = lazy(() => import('../components/layout/LayoutAdmin'))
const Pagetitle = lazy(() => import('../components/layout/Pagetitle'))
const AdminPost = lazy(() => import('../pages/Admin/AdminPost'))
const HomeAdmin = lazy(() => import('../pages/Admin/Home'))
const AdminUser = lazy(() => import('../pages/Admin/AdminUser'))
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, admininfor } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) return <Loading />;
    if (!admininfor) return <Navigate to="/admin" state={{ from: location.pathname }} replace />;

    return children;
};

const PublicRoute = ({ children }) => {
    const { admininfor } = useSelector((state) => state.auth);
    return admininfor ? (
        <Navigate to="/admin/dashboard" replace />
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
                <LazyLoadComponent Component={AuthAdmin} title="SugoiHub" />
            </PublicRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <LayoutAdmin>
                    <LazyLoadComponent Component={HomeAdmin} title="SugoiHub" />
                </LayoutAdmin>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/user',
        element: (
            <ProtectedRoute>
                <LayoutAdmin>
                    <LazyLoadComponent Component={AdminUser} title="SugoiHub" />
                </LayoutAdmin>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },
    {
        path: '/post',
        element: (
            <ProtectedRoute>
                <LayoutAdmin>
                    <LazyLoadComponent Component={AdminPost} title="SugoiHub" />
                </LayoutAdmin>
            </ProtectedRoute>
        ),
        title: 'SugoiHub',
    },

];

export const dashboardRoute = routes.map(({ path, element, title }) => ({
    path,
    element,
    title
}));

