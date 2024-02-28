import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { faEllipsisH, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import SwitchButton from '~/components/SwitchButton';

const UserCard = (props) => {
    const [showAction, setShowAction] = useState(false);
    const roleOptions = ['Moderator', 'Member'];

    const toggle = (e) => {
        e.stopPropagation();
        setShowAction(!showAction);
    };

    return (
        <div onClick={() => setShowAction(false)} className="mb-5 shadow-4Way bg-white p-[16px] text-[1.4rem]">
            <div className="mb-3 relative text-right flex items-center justify-between">
                <div className="flex items-center">
                    <input type="checkbox" checked={props.checkBox} onChange={props.handleCheckBox} />
                </div>
                <FontAwesomeIcon onClick={toggle} className="w-[16px] h-[16px] cursor-pointer" icon={faEllipsisH} />
                <div
                    className={
                        !showAction ? 'hidden' : 'absolute top-[24px] right-0 w-[120px] h-fit shadow-4Way bg-white z-10'
                    }
                >
                    <ul>
                        <li
                            onClick={props.handleDetail}
                            className="w-full hover:bg-[#dddddd] p-[8px] text-left cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="ml-3">Chi tiết</span>
                        </li>
                        <li className="hover:bg-[#dddddd] cursor-pointer">
                            <NavLink className="block p-[8px] text-left" to={`/users/edit/${props.userId}`}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span className="ml-3">Sửa</span>
                            </NavLink>
                        </li>
                        <li
                            onClick={props.handleDelete}
                            className="w-full hover:bg-[#dddddd] p-[8px] text-left cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <span className="ml-3">Xóa</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">STT:</p>
                <p className="flex-1 truncate">{props.id}</p>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">Họ và tên:</p>
                <p title={props.fullName} className="flex-1 truncate">
                    {props.fullName}
                </p>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">Email:</p>
                <p title={props.email} className="flex-1 truncate">
                    {props.email}
                </p>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">Số điện thoại:</p>
                <p title={props.phone} className="flex-1 truncate">
                    {props.phone}
                </p>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">Phòng ban:</p>
                <p title={props.department} className="flex-1 truncate">
                    {props.department}
                </p>
            </div>
            <div className="mb-3 flex items-center">
                <p className="w-[120px] font-bold">Vai trò:</p>
                <p title={props.roleValue} className="flex-1">
                    <DropList
                        options={roleOptions}
                        selectedValue={props.roleValue}
                        setValue={props.setRoleValue}
                        setId={props.setRoleId}
                    />
                </p>
            </div>
            <div className="flex items-center mb-3">
                <p className="font-bold w-[120px]">Trạng thái:</p>
                <SwitchButton
                    value={props.activeValue}
                    checked={props.activeChecked}
                    setValue={props.setIsActived}
                    setId={props.setActiveId}
                />
            </div>
        </div>
    );
};

export default UserCard;
