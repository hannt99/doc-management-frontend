import { useNavigate } from 'react-router-dom';
import * as authServices from '~/services/authServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';


const BlockPage = () => {
    const navigate = useNavigate();

    // Sign out
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

    return (
        <div className="flex items-center justify-center h-screen">
            <section className="bg-white">
                <div className="max-w-screen-xl mx-auto py-8 px-4 lg:py-16 lg:px-6">
                    <div className="max-w-screen-sm mx-auto text-center">
                        <h1 className="mb-4 text-[7.2rem] md:text-[12rem] font-extrabold leading-[1] text-red-600 tracking-tight">
                            403
                        </h1>
                        <p className="mb-4 text-[2.6rem] md:text-[4.2rem] font-bold text-gray-900 tracking-tight ">
                            Truy cập bị từ chối.
                        </p>
                        <p className="mb-4 text-[1.5rem] md:text-[1.8rem] font-light text-gray-500">
                            Xin lỗi, tài khoản của bạn tạm thời bị vô hiệu hóa.
                        </p>
                        <div
                            onClick={handleSignOut}
                            className="inline-block cursor-pointer mt-8 rounded-lg px-6 py-3 bg-red-600 hover:bg-[#1b2e4b] text-center text-[1.5rem] md:text-[1.8rem] font-medium text-white transition-all duration-[1s]"
                        >
                            Đăng xuất ngay
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlockPage;
