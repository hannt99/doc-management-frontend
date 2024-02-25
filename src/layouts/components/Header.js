import { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCaretDown, faUser, faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationCard from '~/components/Card/NotificationCard';
import ChangePasswordForm from '~/components/Form/ChangePasswordForm';
import * as authServices from '~/services/authServices';
import * as notificationServices from '~/services/notificationServices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { UserInfoContext } from '~/App';

const Header = ({ setToggle, socket }) => {
    const [isSave, setIsSave] = useState(false);

    const [toggleSidebar, setToggleSidebar] = useState(false);
    // Toggle sidebar
    useEffect(() => {
        setToggle(toggleSidebar);
    }, [toggleSidebar, setToggle]);

    const [tab, setTab] = useState(false);
    const [notifications, setNotifications] = useState([]);
    // Get all notifications from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await notificationServices.getAllNotification();

            if (res.code === 200) {
                if (tab === false) {
                    setNotifications(res.data);
                } else {
                    setNotifications(res.notRead);
                }
            } else {
                console.log(res);
            }
        };

        fetchApi();
    }, [tab, isSave]);

    const [notification, setNotification] = useState(null);
    // Get realtime notification function
    useEffect(() => {
        socket.current?.on('getNotification', (data) => {
            setNotification({
                notification: data.text,
                linkTask: data.linkTask,
                userId: data.receiverId,
                isRead: data.isRead,
                _id: data._id.find((item) => item.userId === data.receiverId)?.notiId,
                createdAt: Date.now(),
            });
        });
    }, [socket]);
    // Merge notification from db and socket.io
    useEffect(() => {
        if (!notification) return;
        setNotifications((prev) => prev.concat(notification));
    }, [notification]);

    // unRead notification length function
    const notificationNotReadLength = (notifications) => {
        const length = notifications?.filter((item) => item.isRead === false).length;
        return length;
    };

    // isRead notification function
    const handleChangeNotificationStatus = async (id) => {
        await notificationServices.changeNotificationStatus(id);
        setIsSave((isSave) => !isSave);
    };

    // Delete one notification
    const handleDelete = async (id) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn thông báo không?`;
        if (!window.confirm(confirmMsg)) return;

        const res = await notificationServices.deleteNotificationById(id);
        if (res.code === 200) {
            successNotify(res.message, 1500);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res, 1500);
        }
    };

    const { isChangeUserInfo } = useContext(UserInfoContext);
    const [userAvatar, setUserAvatar] = useState('');
    const [userName, setUserName] = useState('');
    // Get current user avatar
    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setUserAvatar(res?.avatar);
            setUserName(res?.fullName);
        };

        fetchApi();
    }, [isChangeUserInfo]);

    const [showChangePassword, setShowChangePassword] = useState(false);

    // Sign out function
    const handleSignOut = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;

        const data = {
            token: refreshToken,
        };
        const res = await authServices.signOut(data);
        if (res.code === 200) {
            localStorage.clear();
            successNotify(res.message, 1500);
            navigate('/sign-in');
        } else {
            errorNotify(res);
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <div className="w-full h-[64px] border-b-[1px] border-solid border-[#cccccc] bg-white pl-[16px] pr-[24px] text-[#9fa9ae] flex items-center justify-between xl:justify-end">
                <div
                    className="xl:hidden p-[8px] hover:text-black cursor-pointer"
                    onClick={() => setToggleSidebar(!toggleSidebar)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <div className="flex items-center">
                    <div className="relative p-[8px] hover:text-black cursor-pointer flex group">
                        <FontAwesomeIcon className="m-auto text-[2.2rem] leading-none" icon={faBell} />
                        <p
                            className={
                                notificationNotReadLength(notifications) > 0
                                    ? 'block absolute top-0 right-0 min-w-[18px] rounded-full bg-red-600 p-1.5 text-center text-[white] text-[1rem] font-semibold leading-none'
                                    : 'hidden'
                            }
                        >
                            {notificationNotReadLength(notifications)}
                        </p>
                        <div className="hidden group-hover:block absolute bottom-[-12px] right-0 w-[100px] h-[24px] bg-transparent"></div>
                        <div className="hidden group-hover:block absolute top-[48px] right-[-80px] md:right-0 shadow-4Way bg-white text-black z-50">
                            <div className="p-[12px] cursor-default">
                                <h3 className="text-[2.4rem] font-bold">Thông báo</h3>
                                <div className="text-[1.5rem] flex items-center gap-x-3">
                                    <div
                                        onClick={() => setTab(false)}
                                        className={
                                            tab === false
                                                ? 'rounded-xl bg-blue-50 hover:bg-[#f1f1f1] p-3 text-blue-600 font-semibold cursor-pointer'
                                                : 'rounded-xl              hover:bg-[#f1f1f1] p-3                 font-semibold cursor-pointer'
                                        }
                                    >
                                        Tất cả
                                    </div>
                                    <div
                                        onClick={() => setTab(true)}
                                        className={
                                            tab === true
                                                ? 'rounded-xl bg-blue-50 hover:bg-[#f1f1f1] p-3 text-blue-600 font-semibold cursor-pointer'
                                                : 'rounded-xl              hover:bg-[#f1f1f1] p-3                 font-semibold cursor-pointer'
                                        }
                                    >
                                        Chưa đọc
                                    </div>
                                </div>
                            </div>
                            <ul className="w-[320px] max-h-[300px] overflow-hidden hover:overflow-y-auto">
                                {notifications?.length > 0 ? (
                                    notifications
                                        ?.sort(function (a, b) {
                                            return new Date(b.createdAt) - new Date(a.createdAt);
                                        })
                                        .map((notification, index) => {
                                            return (
                                                <NotificationCard
                                                    key={index}
                                                    createdAt={notification?.createdAt}
                                                    notification={notification?.notification}
                                                    linkTask={notification?.linkTask}
                                                    isRead={notification.isRead}
                                                    handleChangeNotificationStatus={() =>
                                                        handleChangeNotificationStatus(notification?._id)
                                                    }
                                                    handleDelete={() => {
                                                        handleDelete(notification?._id);
                                                    }}
                                                />
                                            );
                                        })
                                ) : (
                                    <li className="w-full truncate p-[12px] text-center text-[1.3rem] cursor-default">
                                        Không có thông báo
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <div className="ml-8 w-[40px] h-[40px] rounded-full">
                                <img
                                    className="w-full h-full rounded-full object-cover"
                                    src={
                                        userAvatar
                                            ? userAvatar
                                            : 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                    }
                                    alt="avatar"
                                />
                            </div>
                            <h3 className="hidden md:block max-w-[150px] truncate text-black font-bold">{userName}</h3>
                            <FontAwesomeIcon className="group-hover:text-black" icon={faCaretDown} />
                        </div>
                        <div className="hidden group-hover:block w-[180px] h-[24px] absolute bottom-[-12px] right-0 bg-transparent"></div>
                        <div className="hidden group-hover:block absolute top-[50px] right-0 shadow-4Way bg-white text-black">
                            <ul className="w-[180px]">
                                <li className="hover:bg-[#eeeeee] p-[12px] hover:text-[#321fdb] cursor-pointer">
                                    <NavLink className="py-[12px]" to="/profile">
                                        <FontAwesomeIcon icon={faUser} />
                                        <span className="ml-3">Thông tin cá nhân</span>
                                    </NavLink>
                                </li>
                                <li
                                    onClick={() => setShowChangePassword(true)}
                                    className="p-[12px] hover:bg-[#eeeeee] hover:text-[#321fdb] cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faKey} />
                                    <span className="ml-3">Đổi mật khẩu</span>
                                </li>
                                <li
                                    onClick={handleSignOut}
                                    className="border-t hover:bg-[#eeeeee] p-[12px] hover:text-[#321fdb] cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    <span className="ml-3">Đăng xuất</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {showChangePassword && <ChangePasswordForm setShowChangePassword={setShowChangePassword} />}
            <ToastContainer />
        </>
    );
};

export default Header;
