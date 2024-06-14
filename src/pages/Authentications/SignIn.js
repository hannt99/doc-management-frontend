import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import InputField from '~/components/InputField';
import { emailValidator, passwordValidator } from '~/utils/formValidation';

import Loading from '~/components/Loading';

import * as authServices from '~/services/authServices';
import { jwtDecode } from 'jwt-decode';

import { /*successNotify,*/ errorNotify } from '~/components/ToastMessage';

const SignIn = ({ setIsLoggedIn }) => {
    // Input state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Input validation state
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Sign in
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);

        if (!isEmailValid || !isPasswordValid) return;

        setLoading(true);

        const data = {
            email: email,
            password: password,
        };
        const res = await authServices.signIn(data);
        if (res.code === 200) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            const decodedToken = jwtDecode(res.accessToken);           
            setIsLoggedIn(true);
			setLoading(false);
			// successNotify(res.message);
            navigate(decodedToken.role === 'Member' ? '/documents/documents-in' : '/dashboard');
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
                    <h1 className="text-center text-[#9fa9ae] text-[2.0rem] font-medium mb-16">Đăng nhập</h1>
                    <form id="sign-in" autoComplete="on">
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
                        <div className="mt-7">
                            <InputField
                                placeholder="Mật khẩu"
                                name="password"
                                value={password}
                                setValue={setPassword}
                                onBlur={() =>
                                    passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)
                                }
                                className={isPasswordErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{passwordErrMsg.password}</p>
                        </div>
                        <div className="mt-7 text-right">
                            <NavLink className="hover:underline" to="/forgot-password">
                                Quên mật khẩu?
                            </NavLink>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-10 rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] transition-all duration-[1s]"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[.25] z-[999] flex items-center justify-center">
                    <Loading />
                </div>
            )}
            
        </>
    );
};

export default SignIn;
