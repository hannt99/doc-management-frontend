import { Navigate, Outlet } from 'react-router-dom';


const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken') || '';
    return Boolean(accessToken);
};

const isUserRoleMember = () => {
    const userRole = JSON.parse(localStorage.getItem('userRole')) || '';
    return userRole === 'Member';
};

const PublicRoutes = () => {
    const isAuth = isAuthenticated();
    const isMember = isUserRoleMember();
    if (isAuth) {
        const destination = isMember ? '/documents/documents-in' : '/dashboard';
        return <Navigate to={destination} />;
    }
    return <Outlet />;
};

export default PublicRoutes;
