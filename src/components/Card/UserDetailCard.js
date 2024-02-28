import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatVNDate } from '~/utils/formatDateTime';

const UserDetail = (props) => {
    return (
        <div
            onClick={() => props.setShowUserDetail(false)}
            className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[0.3] z-50 flex items-center justify-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-[340px] md:w-[650px] h-fit rounded-md shadow-4Way bg-white p-[24px] md:p-[36px] animate-fadeIn flex flex-col items-center justify-center gap-10 md:flex-row"
            >
                <div
                    onClick={() => props.setShowUserDetail(false)}
                    className="absolute top-0 right-0 p-[16px] text-[2.4rem] leading-[1] cursor-pointer"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className="w-[150px] h-[150px] rounded-full">
                    <img
                        className="w-full h-full object-cover rounded-full"
                        src={
                            props.avatar
                                ? props.avatar
                                : 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                        }
                        alt="avatar"
                    />
                </div>
                <div className="text-[1.4rem] md:text-[1.6rem">
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Họ và tên:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.fullName}</p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Giới tính:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.gender}</p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Ngày sinh:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">
                            {formatVNDate(props.birthDate)}
                        </p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Email:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.email}</p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Số điện thoại:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.phoneNumber}</p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Phòng ban:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.department}</p>
                    </div>
                    <div className="flex my-2">
                        <p className="w-[94px] md:w-[120px] font-bold">Vai trò:</p>
                        <p className="flex-1 w-[200px] whitespace-pre-wrap break-words">{props.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
