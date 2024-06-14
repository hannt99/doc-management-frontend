import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InputField from '~/components/InputField';
import { passwordValidator } from '~/utils/formValidation';

import Loading from '~/components/Loading';

import * as authServices from '~/services/authServices';

import { successNotify, errorNotify } from '~/components/ToastMessage';

const ResetPassword = () => {
    // Input state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Input validation state
    const [isNewPasswordErr, setIsNewPasswordErr] = useState(false);
    const [newPasswordErrMsg, setNewPasswordErrMsg] = useState({});

    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Set new password
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPasswordValid = passwordValidator(newPassword, newPassword, setIsNewPasswordErr, setNewPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            newPassword,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );
        if (!isPasswordValid || !isConfirmPasswordValid) return;

        setLoading(true);

        const data = {
            password: newPassword,
            token: localStorage.getItem('resetPasswordToken'),
        };
        const res = await authServices.resetPassword(data);
        if (res.code === 200) {
            localStorage.removeItem('resetPasswordToken');
            setLoading(false);
            successNotify(res.message, 1500);

            const delay = 3000;
            const timeoutId = setTimeout(() => {
                navigate('/sign-in');
            }, delay);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    return (
        <>
            <div className="w-screen h-screen bg-[#ebedef] flex items-center justify-center">
                <div className="w-[330px] md:w-[450px] h-fit rounded-md shadow-4Way bg-white p-[36px]">
                    <h1 className="text-center text-[#9fa9ae] text-[4.6rem] font-semibold italic">
                        QLVB <span className="text-[2.4rem]">v1.0</span>
                    </h1>
                    <h1 className="mb-16 text-center text-[#9fa9ae] text-[2.0rem] font-medium">Đặt lại mật khẩu</h1>
                    <form>
                        <InputField
                            placeholder="Mật khẩu mới"
                            name="password"
                            value={newPassword}
                            setValue={setNewPassword}
                            onBlur={() =>
                                passwordValidator(newPassword, newPassword, setIsNewPasswordErr, setNewPasswordErrMsg)
                            }
                            className={isNewPasswordErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{newPasswordErrMsg.newPassword}</p>
                        <div className="mt-7">
                            <InputField
                                placeholder="Xác nhận mật khẩu"
                                name="password"
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                                onBlur={() =>
                                    passwordValidator(
                                        confirmPassword,
                                        newPassword,
                                        setIsConfirmPasswordErr,
                                        setConfirmPasswordErrMsg,
                                    )
                                }
                                className={isConfirmPasswordErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{confirmPasswordErrMsg.confirmPassword}</p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-12 rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] transition-all duration-[1s]"
                        >
                            Đặt lại
                        </button>
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

export default ResetPassword;
