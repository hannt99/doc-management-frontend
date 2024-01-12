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
                        <h1 className="text-red-600 text-[7.2rem] md:text-[12rem] leading-[1] tracking-tight font-extrabold mb-4">
                            403
                        </h1>
                        <p className="text-gray-900 text-[2.6rem] md:text-[4.2rem] tracking-tight font-bold mb-4">
                            Truy cập bị từ chối.
                        </p>
                        <p className="text-gray-500 text-[1.5rem] md:text-[1.8rem] font-light mb-4">
                            Xin lỗi, tài khoản của bạn tạm thời bị vô hiệu hóa.
                        </p>
                        <div
                            onClick={handleSignOut}
                            className="bg-red-600 hover:bg-[#1b2e4b] text-white text-[1.5rem] md:text-[1.8rem] font-medium inline-block rounded-lg px-6 py-3 text-center mt-8 cursor-pointer transition-all duration-[1s]"
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
