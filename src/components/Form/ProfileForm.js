import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import { fullNameValidator, emailValidator } from '~/utils/formValidation';
import DropList from '~/components/DropList';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { UserInfoContext } from '~/App';
import * as authServices from '~/services/authServices';
import * as userServices from '~/services/userServices';
import * as departmentServices from '~/services/departmentServices';
import * as reqChangeInfoServices from '~/services/reqChangeInfoServices';
import * as notificationServices from '~/services/notificationServices';
import Loading from '~/components/Loading';

const ProfileForm = ({ formTitle, setShowForm, setIsSave, socket }) => {
    // Input state
    const [fullName, setFullName] = useState('');
    const genderList = ['Nam', 'Nữ'];
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState('');

    // Input validation state
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const userRole = JSON.parse(localStorage.getItem('userRole'));
    const userId = JSON.parse(localStorage.getItem('userId'));
    
    const { isChangeUserInfo, setIsChangeUserInfo } = useContext(UserInfoContext);    
    
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get available user data when edit user
    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setFullName(res.fullName);
            setGender(res.gender);
            setBirth(res.birthDate);
            setEmail(res.email);
            setPhone(res.phoneNumber);
            setDepartment(res.department);
        };

        fetchApi();
    }, []);

    // Get public info of user
    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            setAllUsers(res.data);
        };

        fetchApi();
    }, []);

    // Get all departments from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await departmentServices.getAllDepartment(1, 1, '');
            const departmentArray = res.allDepartments
                ?.filter((item) => item.status !== false)
                .map((item) => item.departmentName);
            setDepartments(departmentArray);
        };

        fetchApi();
    }, []);

    // Update user profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);

        if (!isFullNameValid || !isEmailValid) return;

        setLoading(true);

        const data = {
            fullName: fullName,
            gender: gender,
            birthDate: birth,
            email: email,
            phoneNumber: phone,
            department: department,
        };

        const res = await userServices.updateUser(userId, data);
        if (res.code === 200) {
            setLoading(false);
            setShowForm(false);
            successNotify(res.message, 1500);
            setIsSave(true);
            setIsChangeUserInfo(!isChangeUserInfo);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    // Member send request to admin
    const handleRequestChange = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);

        if (!isFullNameValid || !isEmailValid) return;

        setLoading(true);

        const dataToChange = {
            fullName: fullName,
            gender: gender,
            birthDate: birth,
            email: email,
            phoneNumber: phone,
            department: department,
        };

        const finalData = {
            userId: userId,
            dataToChange: dataToChange,
        };

        const res = await reqChangeInfoServices.createReqChangeInfo(finalData);

        if (res.code === 200) {
            await userServices.changeReqChangeInfoStatus(userId, { isReqChangeInfo: true });

            const newNoti = await notificationServices.createNotification({
                notification: `Yêu cầu đổi thông tin của ${fullName}`,
                linkTask: `${process.env.REACT_APP_BASE_URL}/users/request-change`,
                userId: allUsers?.find((item) => item.role === 'Admin')._id, // one receiver
            });

            socket.current?.emit('sendNotification', {
                senderId: userId,
                _id: [{ notiId: newNoti.data._id, userId: newNoti.data.userId }],
                text: `Yêu cầu đổi thông tin của ${fullName}`,
                linkTask: `${process.env.REACT_APP_BASE_URL}/users/request-change`,
                isRead: false,
                receiverId: [allUsers?.find((item) => item.role === 'Admin')._id], // [one receiver]
            });
            
            setLoading(false);
            setShowForm(false);
            successNotify(res.message, 1500);
            setIsSave(true);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowForm(false)}
                className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[0.3] z-50 flex items-center justify-center"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[330px] md:w-[450px] h-fit shadow-4Way rounded-md bg-white p-[36px] animate-fadeIn"
                >
                    <h1 className="text-center text-[#9fa9ae] text-[4.6rem] font-semibold italic">
                        QLVB <span className="text-[2.4rem]">v1.0</span>
                    </h1>
                    <h1 className="mb-16 text-center text-[#9fa9ae] text-[2.0rem] font-medium">{formTitle}</h1>
                    <form autoComplete="on">
                        <InputField
                            placeholder="Họ và tên"
                            id="fullName"
                            value={fullName}
                            setValue={setFullName}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                            className={isFullNameErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                        <div className="flex items-center mt-7">
                            {genderList.map((g, index) => {
                                return (
                                    <div key={index} className="flex items-center mr-5">
                                        <InputField
                                            name="radio"
                                            checked={gender === g}
                                            setValue={() => setGender(g)}
                                            className="w-[15px] h-[15px] flex"
                                        />
                                        <label className="ml-3 text-[1.5rem]">{g}</label>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-7">
                            <InputField
                                placeholder="Ngày sinh"
                                name="date"
                                value={birth}
                                setValue={setBirth}
                                className="default leading-[1.3]"
                            />
                        </div>
                        <div className="mt-7">
                            <InputField
                                placeholder="Email"
                                id="email"
                                name="email"
                                value={email}
                                setValue={setEmail}
                                onBlur={() => emailValidator(email, setIsEmailErr, setEmailErrMsg)}
                                className={isEmailErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{emailErrMsg.email}</p>
                        </div>
                        <div className="mt-7">
                            <InputField
                                placeholder="Số điện thoại"
                                id="phone"
                                value={phone}
                                setValue={setPhone}
                                className="default"
                            />
                        </div>
                        <div className="mt-7">
                            <DropList
                                options={departments}
                                selectedValue={department}
                                setValue={setDepartment}
                                setId={() => undefined}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-5">
                            <button
                                onClick={userRole === 'Admin' ? handleSubmit : handleRequestChange}
                                className="mt-12 w-full rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={userRole === 'Admin' ? faFloppyDisk : faPaperPlane} />{' '}
                                {userRole === 'Admin' ? 'Lưu' : 'Gửi yêu cầu'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="mt-12 w-full rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={faXmark} /> Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[.15] z-[999] flex items-center justify-center">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default ProfileForm;
