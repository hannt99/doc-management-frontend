import { Navigate, Outlet } from 'react-router-dom';

const auth = () => {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
        return false;
    }
    return true;
};

const ProtectedRoutes = () => {
    const isAuth = auth();
    return !isAuth ? <Navigate to="/sign-in"/> :  <Outlet/>;
};

export default ProtectedRoutes;
