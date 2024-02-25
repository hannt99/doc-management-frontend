import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import { passwordValidator } from '~/utils/formValidation';
import * as userServices from '~/services/userServices';
import Loading from '~/components/Loading';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const ChangePasswordForm = ({ setShowChangePassword }) => {
    const [loading, setLoading] = useState(false);
    
    // Input state
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Input validation state
    const [isOldPasswordErr, setIsOldPasswordErr] = useState(false);
    const [oldPasswordErrMsg, setOldPasswordErrMsg] = useState({});

    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    // Change password function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isOldPasswordValid = passwordValidator(
            oldPassword,
            oldPassword,
            setIsOldPasswordErr,
            setOldPasswordErrMsg,
        );
        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            password,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );

        if (!isOldPasswordValid || !isPasswordValid || !isConfirmPasswordValid) return;
        setLoading(true);
        const data = {
            oldPassword: oldPassword,
            newPassword: password,
        };
        const res = await userServices.changePassword(data);
        if (res.code === 200) {
            setLoading(false);
            successNotify(res.message, 1500);
            setShowChangePassword(false);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowChangePassword(false)}
                className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[0.3] flex items-center justify-center"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[330px] md:w-[450px] h-fit rounded-md shadow-4Way bg-white p-[36px] animate-fadeIn z-[999]"
                >
                    <h1 className="text-center text-[#9fa9ae] text-[4.6rem] font-semibold italic">
                        QLVB <span className="text-[2.4rem]">v1.0</span>
                    </h1>
                    <h1 className="mb-16 text-center text-[#9fa9ae] text-[2.0rem] font-medium">Đổi mật khẩu</h1>
                    <form>
                        <InputField
                            placeholder="Mật khẩu cũ"
                            name="password"
                            value={oldPassword}
                            setValue={setOldPassword}
                            className={isOldPasswordErr ? 'invalid' : 'default'}
                            onBlur={() =>
                                passwordValidator(oldPassword, oldPassword, setIsOldPasswordErr, setOldPasswordErrMsg)
                            }
                        />
                        <p className="text-red-600 text-[1.3rem]">{oldPasswordErrMsg.oldPassword}</p>
                        <div className="mt-7">
                            <InputField
                                placeholder="Mật khẩu mới"
                                name="password"
                                value={password}
                                setValue={setPassword}
                                className={isPasswordErr ? 'invalid' : 'default'}
                                onBlur={() =>
                                    passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)
                                }
                            />
                            <p className="text-red-600 text-[1.3rem]">{passwordErrMsg.newPassword}</p>
                        </div>
                        <div className="mt-7">
                            <InputField
                                placeholder="Xác nhận mật khẩu"
                                name="password"
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                                className={isConfirmPasswordErr ? 'invalid' : 'default'}
                                onBlur={() =>
                                    passwordValidator(
                                        confirmPassword,
                                        password,
                                        setIsConfirmPasswordErr,
                                        setConfirmPasswordErrMsg,
                                    )
                                }
                            />
                            <p className="text-red-600 text-[1.3rem]">{confirmPasswordErrMsg.confirmPassword}</p>
                        </div>
                        <div className="flex items-center justify-center gap-5">
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-12 rounded-md px-[16px] py-[8px] bg-[#321fdb] hover:bg-[#1b2e4b] text-[white] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} /> Lưu
                            </button>
                            <button
                                onClick={() => setShowChangePassword(false)}
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

export default ChangePasswordForm;
