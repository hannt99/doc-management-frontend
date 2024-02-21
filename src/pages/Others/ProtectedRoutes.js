import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    return Boolean(accessToken);
};

const ProtectedRoutes = () => {
    const isAuth = isAuthenticated();
    if (!isAuth) {
        const destination = '/sign-in/';
        return <Navigate to={destination} />;
    }
    return <Outlet />;
};

export default ProtectedRoutes;
