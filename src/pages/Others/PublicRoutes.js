import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    return Boolean(accessToken);
};

const isUserRoleMember = () => {
    return localStorage.getItem('userRole') === 'Member';
};

const PublicRoutes = () => {
    const isAuth = isAuthenticated();
    if (isAuth) {
        const isMember = isUserRoleMember();
        const destination = isMember ? '/documents/documents-in' : '/dashboard';
        return <Navigate to={destination} />;
    }
    return <Outlet />;
};

export default PublicRoutes;
