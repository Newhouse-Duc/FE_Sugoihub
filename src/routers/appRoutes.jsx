
import { Routes, Route } from 'react-router-dom';
import Loading from '../components/loading/loading';
import { Suspense } from 'react';
import { homeRoutes } from './homeRoutes';
import { dashboardRoute } from './dashboardRoutes';

import { lazy } from 'react';
const AuthWrapper = lazy(() => import('../components/auth/AuthWrapper'))
const AuthAdminWrapper = lazy(() => import('../components/auth/AuthAdminWrapper'))
const NotFound = lazy(() => import('../pages/404NotFound'))


const AppRoutes = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Routes dành cho user */}
                <Route
                    path="/*"
                    element={
                        <AuthWrapper>
                            <Routes>
                                {homeRoutes.map(({ path, element }) => (
                                    <Route key={path} path={path} element={element} />
                                ))}
                                {/* Route not found cho user */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </AuthWrapper>
                    }
                />
                {/* Routes dành cho admin */}
                <Route
                    path="/admin/*"
                    element={
                        <AuthAdminWrapper>
                            <Routes>
                                {dashboardRoute.map(({ path, element }) => (
                                    <Route key={path} path={path} element={element} />
                                ))}
                                {/* Route not found cho admin */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </AuthAdminWrapper>
                    }
                />
                {/* Route not found tổng thể */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};


export default AppRoutes;
