import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import { fullNameValidator, emailValidator, dropListValidator } from '~/utils/formValidation';
import { useFetchDepartments } from '~/hooks';
import * as userServices from '~/services/userServices';
import Loading from '~/components/Loading';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateUser = ({ title }) => {
    const [loading, setLoading] = useState(false);

    // Input state
    const [fullName, setFullName] = useState('');
    const genderList = ['Nam', 'Nữ'];
    const [gender, setGender] = useState('Nam');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const departments = useFetchDepartments({ isActived: false });
    const [department, setDepartment] = useState('');

    // Input validation state
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});
    const [isDepartmentErr, setIsDepartmentErr] = useState(false);
    const [departmentErrMsg, setDepartmentErrMsg] = useState({});

    const navigate = useNavigate();

    const { id } = useParams();

    // Get available user data when edit user
    useEffect(() => {
        if (!id) return;

        const fetchApi = async () => {
            const res = await userServices.getUserById(id);
            setFullName(res.data.fullName);
            setGender(res.data.gender);
            setDate(res.data.birthDate);
            setEmail(res.data.email);
            setPhone(res.data.phoneNumber);
            setDepartment(res.data.department);
        };

        fetchApi();
    }, [id]);

    // Create or edit user function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        const isDepartmentValid = dropListValidator(department, setIsDepartmentErr, setDepartmentErrMsg);

        if (!isFullNameValid || !isEmailValid || !isDepartmentValid) return;

        setLoading(true);

        const data = {
            fullName: fullName,
            gender: gender,
            birthDate: date,
            email: email,
            phoneNumber: phone,
            department: department,
        };

        let res;
        if (id) {
            res = await userServices.updateUser(id, data);
        } else {
            res = await userServices.createUser(data);
        }

        if (res.code === 200) {
            setLoading(false);
            successNotify(res.message, 1500);
            const delay = 3000;
            const timeoutId = setTimeout(() => {
                navigate('/users');
            }, delay);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    return (
        <>
            <div className="shadow-4Way border-t-[3px] border-blue-600 bg-white p-[16px]">
                <h1 className="text-[2rem] font-bold">{title}</h1>
                <form autoComplete="on">
                    <div className="mt-8">
                        <label className="font-bold">
                            Họ và tên: <span className="text-red-600">*</span>
                        </label>
                        <InputField
                            placeholder="Tên người dùng"
                            id="fullName"
                            value={fullName}
                            setValue={setFullName}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                            className={isFullNameErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                    </div>
                    <div className="mt-7 flex flex-col md:flex-row md:items-center">
                        <label className="mr-7 font-bold">Giới tính:</label>
                        <div className="flex items-center">
                            {genderList.map((g, index) => {
                                return (
                                    <div key={index} className="mr-5 flex items-center">
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
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">Ngày sinh:</label>
                        <InputField name="date" value={date} setValue={setDate} className="default" />
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">
                            Email: <span className="text-red-600">*</span>
                        </label>
                        <InputField
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            setValue={setEmail}
                            onBlur={() => emailValidator(email, setIsEmailErr, setEmailErrMsg)}
                            className={isEmailErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{emailErrMsg.email}</p>
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">Số điện thoại:</label>
                        <InputField
                            placeholder="Số điện thoại"
                            id="phone"
                            value={phone}
                            setValue={setPhone}
                            className="default"
                        />
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">
                            Phòng ban: <span className="text-red-600">*</span>
                        </label>
                        <DropList
                            options={departments}
                            selectedValue={department}
                            setValue={setDepartment}
                            setId={() => undefined}
                            isErr={isDepartmentErr}
                            onBlur={() => dropListValidator(department, setIsDepartmentErr, setDepartmentErrMsg)}
                        />
                        <p className="text-red-600 text-[1.3rem]">{departmentErrMsg.department}</p>
                    </div>
                    <div className="mt-12 block md:flex items-center gap-5">
                        <button
                            className="w-full md:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-center transition-all duration-[1s]"
                            onClick={handleSubmit}
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                        </button>
                        <NavLink
                            to="/users"
                            className="block mt-4 md:mt-0 w-full md:w-fit rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-center transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                        </NavLink>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[.15] z-[999] flex items-center justify-center">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default CreateUser;
