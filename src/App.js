import { createContext, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes, ProtectedRoutes, BlockPage, Page404, Dashboard, Profile } from '~/pages/Others/index.js';
import { SignIn, ForgotPassword, ResetPassword } from '~/pages/Authentications/index.js';
import DefaultLayout from '~/layouts/DefaultLayout';
import { Department, CreateDepartment } from '~/pages/Departments/index.js';
import { User, CreateUser, RequestChange } from '~/pages/Users/index.js';
import { DocumentIn, /*DocumentOut, DocumentDetail,*/ CreateDocument } from '~/pages/Documents/index.js';
import * as authServices from '~/services/authServices';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import customLog from './utils/customLog';

export const UserInfoContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [activeFlag, setActiveFlag] = useState(JSON.parse(localStorage.getItem('activeFlag')) || false);
    // Get isActived user from accessToken after sign in
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            // customLog(res);
            setActiveFlag(res.isActived);
        };

        fetchApi();
    }, [isLoggedIn]);
    // Save isActived user in localStorage after sign in
    useEffect(() => {
        localStorage.setItem('activeFlag', JSON.stringify(activeFlag));
    }, [isLoggedIn, activeFlag]);

    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')) || '');
    const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('userId')) || '');
    // Get userRole and userId from accessToken after sign in
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const decodedToken = jwtDecode(accessToken);
        setUserRole(decodedToken.role);
        setUserId(decodedToken._id);
    }, [isLoggedIn]);
    // Save userRole in localStorage after sign in
    useEffect(() => {
        localStorage.setItem('userRole', JSON.stringify(userRole));
    }, [isLoggedIn, userRole]);
    // Save userId in localStorage after sign in
    useEffect(() => {
        localStorage.setItem('userId', JSON.stringify(userId));
    }, [isLoggedIn, userId]);

    const [isChangeUserInfo, setIsChangeUserInfo] = useState(false);

    // Init socket.io server
    const socket = useRef();
    useEffect(() => {
        socket.current = io(PROSERVER, { transports: ['websocket'] });
    }, []);

    // Send info to socket.io server
    useEffect(() => {
        socket.current?.emit('addUser', userId);
        // socket.current?.on('getUsers', (users) => {
        //     console.log(users);
        // });
    }, [userId]);

    // Check expire of refresh to logout
    useEffect(() => {
        const checkRefreshExp = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return;

            const decodedToken = jwtDecode(refreshToken);
            let currentDate = new Date();
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                await authServices.signOut({ token: refreshToken });
                localStorage.clear();
            }
        };

        checkRefreshExp();
    }, []);

    // Get user temp role
    const getTempRole = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const decodedToken = jwtDecode(accessToken);
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
                                        getTempRole() === 'Admin' || getTempRole() === 'Moderator' ? (
                                            <DefaultLayout socket={socket}>
                                                <Dashboard />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/departments"
                                    element={
                                        userRole === 'Admin' || userRole === 'Moderator' ? (
                                            <DefaultLayout socket={socket}>
                                                <Department />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/departments/create"
                                    element={
                                        userRole === 'Admin' || userRole === 'Moderator' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDepartment title={'Thêm phòng ban mới'} />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/departments/edit/:id"
                                    element={
                                        userRole === 'Admin' || userRole === 'Moderator' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDepartment title={'Chỉnh sửa phòng ban'} />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route path="/users" element={<Navigate to="/users/all" />} />
                                <Route
                                    path="/users/all"
                                    element={
                                        userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <User />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/users/create"
                                    element={
                                        userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateUser title="Thêm thành viên mới" />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/users/edit/:id"
                                    element={
                                        userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateUser title="Chỉnh sửa thành viên" />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/users/request-change"
                                    element={
                                        userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <RequestChange socket={socket} />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <Profile socket={socket} />
                                        </DefaultLayout>
                                    }
                                />
                                <Route path="/documents" element={<Navigate to="/documents/documents-in" />} />
                                <Route
                                    path="/documents/documents-in"
                                    element={
                                        <DefaultLayout socket={socket}>
                                            <DocumentIn />
                                        </DefaultLayout>
                                    }
                                />
                                <Route
                                    path="/documents/documents-in/create"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    title="Thêm văn bản đến mới"
                                                    inputLabel="đến"
                                                    path="documents-in"
                                                    documentIn={true}
                                                    socket={socket}
                                                />
                                            </DefaultLayout>
                                        ) : (
                                            <Page404 />
                                        )
                                    }
                                />
                                <Route
                                    path="/documents/documents-in/edit/:id"
                                    element={
                                        userRole === 'Moderator' || userRole === 'Admin' ? (
                                            <DefaultLayout socket={socket}>
                                                <CreateDocument
                                                    title="Sửa văn bản đến"
                                                    inputLabel="đến"
                                                    path="documents-in"
                                                    documentIn={true}
                                                    socket={socket}
                                                />
                                            </DefaultLayout>
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
            <ToastContainer />
        </UserInfoContext.Provider>
    );
}

export default App;
