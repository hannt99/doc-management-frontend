import { useState, useEffect, useContext, useRef } from 'react';
import FormData from 'form-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserInfoContext } from '~/App';
import * as authServices from '~/services/authServices';
import * as userServices from '~/services/userServices';
import ProfileForm from '~/components/Form/ProfileForm';
// import { useFetchTasks } from '~/hooks';
import { formatVNDate } from '~/utils/formatDateTime';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import customLog from '~/utils/customLog';

const Profile = ({ socket }) => {
    const [currUser, setCurrUser] = useState({});

    const ref = useRef();

    const { isChangeUserInfo, setIsChangeUserInfo } = useContext(UserInfoContext);

    const [isReqChangeInfo, setIsReqChangeInfo] = useState(true);

    const userRole = JSON.parse(localStorage.getItem('userRole'));

    const [showProfileForm, setShowProfileForm] = useState(false);

    // const allTasks = useFetchTasks();

    const [isSave, setIsSave] = useState(false);

    // Change avatar function
    const changeAvatar = async (e) => {
        const data = new FormData();
        const file = e.target.files[0];
        if (!file) return;

        data.append('myFile', file);
        const res = await userServices.changeAvatar(data);

        if (res.code === 200) {
            successNotify(res.message, 1500);
            setIsChangeUserInfo(!isChangeUserInfo);
        } else {
            errorNotify(res, 1500);
        }
    };

    // Remove avatar function
    const handleRemoveAvatar = async () => {
        const confirmMsg = 'Bạn có chắc muốn xóa ảnh đại diện không?';
        if (!window.confirm(confirmMsg)) return;

        const avatar = currUser?.avatar || '';
        const filename = avatar.substring(avatar.lastIndexOf('/') + 1); // "http://localhost:8888/static/1707808225005-ricardo.jpg" => "1707808225005-ricardo.jpg"
        const res = await userServices.removeAvatar(filename);

        if (res.code === 200) {
            successNotify(res.message, 1500);
            ref.current.value = '';
            setIsChangeUserInfo(!isChangeUserInfo);
        } else {
            errorNotify(res, 1500);
        }
    };

    // Get current user data
    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setCurrUser(res);
            setIsReqChangeInfo(res.isReqChangeInfo);
        };

        fetchApi();
    }, [isChangeUserInfo, isSave]);

    // Get all complete tasks quantity
    const getCompleteTaskQty = () => {
        // const qty = allTasks?.filter((item) => item?.progress === 'Hoàn thành');
        // return qty;

        return [1, 2, 3];
    };

    // Get complete percentage of all tasks
    const getPercentProgress = () => {
        // return `${(getCompleteTaskQty().length / allTasks.length) * 100}%`;
        return `80%`;
    };

    return (
        <>
            <div className="h-full flex flex-col xl:flex-row gap-8">
                <div className="w-full xl:w-[320px] flex flex-col gap-8">
                    <div className="h-[320px] w-full xl:w-[320px] bg-white shadow-4Way flex">
                        <div className="m-auto">
                            <label className="label">
                                <input
                                    className="hidden"
                                    disabled={currUser?.avatar === '' ? false : true}
                                    ref={ref}
                                    type="file"
                                    name="myFile"
                                    onChange={(e) => changeAvatar(e)}
                                />
                                <figure className="relative w-[200px] h-[200px]">
                                    <img
                                        src="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                                        className="box-border w-[200px] h-[200px] border-2 border-solid border-[#ccc] rounded-full shadow-md hover:shadow-xl transition-all cursor-pointer"
                                        alt="avatar"
                                    />
                                    <figcaption className="absolute top-0 w-full h-full rounded-full bg-[#000] hover:bg-[#000] opacity-0 hover:opacity-40 cursor-pointer transition-all flex">
                                        <img
                                            className="w-[50px] h-[50px] m-auto"
                                            src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png"
                                            alt=""
                                        />
                                    </figcaption>
                                    <div
                                        className={
                                            currUser?.avatar !== ''
                                                ? 'group absolute top-0 w-[200px] h-[200px]'
                                                : 'hidden'
                                        }
                                    >
                                        <img
                                            src={currUser?.avatar}
                                            className="absolute top-0 w-full h-full box-border border-2 border-solid border-[#ccc] rounded-full shadow-md hover:shadow-xl transition-all"
                                            alt="avatar"
                                        />
                                        <div
                                            onClick={handleRemoveAvatar}
                                            className="hidden group-hover:block absolute top-0 right-0 text-[2rem] cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>
                                </figure>
                            </label>
                        </div>
                    </div>
                    <div className="w-full xl:w-[320px] h-fit bg-white p-[12px] shadow-4Way">
                        <div>
                            <h1 className="mb-7 text-[2.2rem] font-bold">Tất cả nhiệm vụ</h1>
                            <h3 className="text-[1.4rem] font-semibold">Mức độ hoàn thành</h3>
                            <div className="mt-3 w-full rounded-full bg-gray-200">
                                <div
                                    title={getPercentProgress() !== 'NaN%' ? getPercentProgress() : '100%'}
                                    style={{ width: getPercentProgress() }}
                                    className={`rounded-full bg-blue-600 p-4 text-center text-blue-100 text-[1.4rem] font-medium leading-none `}
                                ></div>
                            </div>
                            <div className="mt-9 flex justify-between">
                                <div>
                                    <h3 className="rounded-xl bg-[#cccccc] px-2 text-white text-[1.4rem]">
                                        {userRole === 'Member' ? 'Được giao' : 'Đã tạo'}
                                    </h3>
                                    <p className="font-semibold text-[#cccccc] text-center">{5}</p>
                                </div>
                                <div>
                                    <h3 className="rounded-xl bg-green-600 px-2 text-white text-[1.4rem]">
                                        Hoàn thành
                                    </h3>
                                    <p className="font-semibold text-green-600 text-center">
                                        {getCompleteTaskQty().length}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="rounded-xl bg-red-600 px-2 text-white text-[1.4rem]">
                                        Chưa hoàn thành
                                    </h3>
                                    <p className="font-semibold text-red-600 text-center">{'3'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="h-fit shadow-4Way px-10 bg-white">
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Họ và tên:</span>{' '}
                            <span className="flex-1">{currUser?.fullName}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Giới tính:</span>{' '}
                            <span className="flex-1">{currUser?.gender}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Ngày sinh:</span>{' '}
                            <span className="flex-1">{formatVNDate(currUser?.birthDate)}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Email:</span>{' '}
                            <span className="flex-1">{currUser?.email}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Số điện thoại:</span>{' '}
                            <span className="flex-1">{currUser?.phoneNumber}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Phòng ban:</span>{' '}
                            <span className="flex-1">{currUser?.department}</span>
                        </p>
                        <hr />
                        <p className="py-[12px] text-[1.8rem] flex">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Vai trò:</span>{' '}
                            <span className="flex-1">{currUser?.role}</span>
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowProfileForm(true)}
                            className={
                                isReqChangeInfo
                                    ? 'mt-7 w-full lg:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.5rem]  transition-all duration-[1s] disabled'
                                    : 'mt-7 w-full lg:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.5rem]  transition-all duration-[1s]'
                            }
                        >
                            {isReqChangeInfo ? 'Đã gửi yêu cầu' : 'Chỉnh sửa'}
                        </button>
                    </div>
                </div>
            </div>
            {showProfileForm && (
                <ProfileForm
                    formTitle="Chỉnh sửa thông tin cá nhân"
                    setShowForm={setShowProfileForm}
                    setIsSave={() => setIsSave(!isSave)}
                    socket={socket}
                />
            )}
        </>
    );
};

export default Profile;
