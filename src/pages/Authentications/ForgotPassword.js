import { useState } from 'react';
import { useNavigate, NavLink} from 'react-router-dom';
import InputField from '~/components/InputField';
import { emailValidator } from '~/utils/formValidation';
import Loading from '~/components/Loading';
import * as authServices from '~/services/authServices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const ForgotPassword = () => {
    // Input state
    const [email, setEmail] = useState('');

    // Input validation state
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Send an email containing a link to reset the password
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        if (!isEmailValid) return;

        setLoading(true);

        const data = {
            email: email,
        };
        const res = await authServices.forgotPassword(data);
        if (res.code === 200) {
            localStorage.setItem('resetPasswordToken', res.resetPasswordToken);
            setLoading(false);
            successNotify(res.message, 1500);

            const delay = 2500;
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
            <div className="flex items-center justify-center w-screen h-screen bg-[#ebedef]">
                <div className="w-[330px] md:w-[450px] h-fit bg-white p-[36px] rounded-md shadow-4Way">
                    <h1 className="text-[#9fa9ae] text-center text-[4.6rem] font-semibold italic">
                        QLVB <span className="text-[2.4rem]">v1.0</span>
                    </h1>
                    <h1 className="text-[#9fa9ae] text-center text-[2.0rem] font-medium mb-16">Quên mật khẩu</h1>
                    <form autoComplete="on">
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
                        <div className="text-right mt-7">
                            <NavLink className="hover:underline" to="/sign-in">
                                {'<<'} Trở về đăng nhập
                            </NavLink>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full rounded-md bg-[#321fdb] mt-10 text-[white] px-[16px] py-[8px] hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[.15] z-[999]">
                    <Loading />
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default ForgotPassword;
