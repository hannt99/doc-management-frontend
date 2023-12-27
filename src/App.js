import { createContext, useState /*useEffect,*/ /*, useRef*/ } from 'react';

// import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, ForgotPassword, ResetPassword } from '~/pages/Authentications';

import { PublicRoutes, ProtectedRoutes, /*Dashboard, Profile,*/ BlockPage, Page404 } from '~/pages/Others/index.js';

import jwt_decode from 'jwt-decode';
import DefaultLayout from '~/layouts/DefaultLayout';

// import * as authServices from '~/services/authServices';

export const UserInfoContext = createContext();

function App() {
    const [isChangeUserInfo, setIsChangeUserInfo] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeFlag, setActiveFlag] = useState(JSON.parse(localStorage.getItem('activeFlag')) || true);
    // const [activeFlag, setActiveFlag] = useState(false);

    // Get user temp role
    const getTempRole = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.role;
    };

    return (
        <UserInfoContext.Provider value={{ isChangeUserInfo, setIsChangeUserInfo }}>
            <Router>
                <Routes>
                    <Route element={<PublicRoutes />}>
                        <Route path="/sign-in" element={<SignIn setIsLoggedIn={() => setIsLoggedIn(!isLoggedIn)} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>
                    <Route element={<ProtectedRoutes />}>
                        {activeFlag === true ? (
                            <>
                                <Route
                                    path="/dashboard"
                                    element={
                                        getTempRole() === 'Moderator' || getTempRole() === 'Admin' ? (
                                            <DefaultLayout /*socket={socket}*/>{/* <Dashboard /> */}</DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                            </>
                        ) : (
                            <Route path="*" element={<BlockPage />} />
                        )}
                    </Route>
                    <Route path="/" element={<Navigate to="/sign-in" />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Router>
        </UserInfoContext.Provider>
    );
}

export default App;
