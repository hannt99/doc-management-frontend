import { useState, useEffect } from 'react';
import SidebarItem from '~/components/SidebarItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGauge,
    faFile,
    faAngleDown,
    faAngleRight,
    faArrowTurnDown,
    faArrowTurnUp,
    faListCheck,
    faLayerGroup,
    faUser,
    faUsers,
    faPen,
    faChartColumn,
    faFileLines,
    faTableList,
    faGear,
} from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';


const Sidebar = () => {
    // const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')));
    const [userRole, setUserRole] = useState(!localStorage.getItem('userRole') ? '' : localStorage.getItem('userRole'));
    const [toggleSubMenu1, setToggleSubMenu1] = useState(false);
    const [toggleSubMenu2, setToggleSubMenu2] = useState(false);
    const [toggleSubMenu3, setToggleSubMenu3] = useState(false);

    // Get user role function
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
    }, []);

    return (
        <div className="w-full h-full bg-[#3c4b64] overflow-auto">
            <div className="flex h-[64px] bg-[#303c54] italic">
                <h1 className="text-white text-[3.6rem] m-auto">
                    QLVB <span className="text-[1.6rem]">v1.0</span>
                </h1>
            </div>
            <ul>
                <div className={userRole === 'Moderator' || userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem path="/dashboard" icon={faGauge} title="Bảng điều khiển" />
                </div>

                <SidebarItem
                    path="/documents"
                    className="hello"
                    icon={faFile}
                    title="Văn bản"
                    onClick={() => setToggleSubMenu1(!toggleSubMenu1)}
                    firstElement={
                        <FontAwesomeIcon
                            className="absolute top-[50%] translate-y-[-50%] right-[16px] text-[#ffffff]/[0.3]"
                            icon={toggleSubMenu1 ? faAngleDown : faAngleRight}
                        />
                    }
                    secondElement={
                        <ul
                            className={
                                !toggleSubMenu1
                                    ? 'max-h-0 transition-height duration-[1s] overflow-hidden'
                                    : 'max-h-[300px] transition-height duration-[1.5s] overflow-hidden'
                            }
                        >
                            <SidebarItem path="/documents/documents-in" icon={faArrowTurnDown} title="Văn bản đến" />
                            <SidebarItem path="/documents/documents-out" icon={faArrowTurnUp} title="Văn bản đi" />
                        </ul>
                    }
                />
                
                <SidebarItem path="/tasks" icon={faListCheck} title="Việc cần làm" />
                <div className={userRole === 'Moderator' || userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem path="/departments" icon={faLayerGroup} title="Phòng ban" />
                </div>
                <div className={userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem
                        onClick={() => setToggleSubMenu3(!toggleSubMenu3)}
                        className="hello"
                        path="/users"
                        icon={faUser}
                        title="Thành viên"
                        firstElement={
                            <FontAwesomeIcon
                                className="absolute top-[50%] translate-y-[-50%] right-[16px] text-[#ffffff]/[0.3]"
                                icon={toggleSubMenu2 ? faAngleDown : faAngleRight}
                            />
                        }
                        secondElement={
                            <ul
                                className={
                                    !toggleSubMenu2
                                        ? 'max-h-0 transition-height duration-[1s] overflow-hidden'
                                        : 'max-h-[300px] transition-height duration-[1.5s] overflow-hidden'
                                }
                            >
                                <SidebarItem path="/users/all" icon={faUsers} title="Tất cả thành viên" />
                                <SidebarItem path="/users/request-change" icon={faPen} title="Yêu cầu đổi thông tin" />
                            </ul>
                        }
                    />
                </div>
                <div className={userRole === 'Moderator' || userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem
                        onClick={() => setToggleSubMenu2(!toggleSubMenu2)}
                        className="hello"
                        path="/statistics"
                        icon={faChartColumn}
                        title="Báo cáo thống kê"
                        firstElement={
                            <FontAwesomeIcon
                                className="absolute top-[50%] translate-y-[-50%] right-[16px] text-[#ffffff]/[0.3]"
                                icon={toggleSubMenu3 ? faAngleDown : faAngleRight}
                            />
                        }
                        secondElement={
                            <ul
                                className={
                                    !toggleSubMenu3
                                        ? 'max-h-0 transition-height duration-[1s] overflow-hidden'
                                        : 'max-h-[300px] transition-height duration-[1.5s] overflow-hidden'
                                }
                            >
                                <SidebarItem path="/statistics/documents" icon={faFileLines} title="Thống kê văn bản" />
                                <SidebarItem path="/statistics/tasks" icon={faTableList} title="Thống kê công việc" />
                                <SidebarItem path="/statistics/systems" icon={faGear} title="Thống kê hệ thống" />
                            </ul>
                        }
                    />
                </div>
            </ul>
        </div>
    );
};

export default Sidebar;
