import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '../SwitchButton';

const DepartmentCard = (props) => {
    const [showAction, setShowAction] = useState(false);

    const toggle = (e) => {
        e.stopPropagation();
        setShowAction(!showAction);
    };

    return (
        <div onClick={() => setShowAction(false)} className="mb-5 shadow-4Way bg-white p-[16px] text-[1.4rem]">
            <div className="relative mb-3 flex items-center justify-between text-right">
                <div className="flex items-center">
                    <input type="checkbox" checked={props.checkBox} onChange={props.handleCheckBox} />
                </div>
                <FontAwesomeIcon onClick={toggle} icon={faEllipsisH} className="w-[16px] h-[16px] cursor-pointer" />
                <div
                    className={
                        !showAction ? 'hidden' : 'absolute top-[24px] right-0 w-[120px] h-fit shadow-4Way bg-white z-10'
                    }
                >
                    <ul>
                        <li onClick={() => setShowAction(false)} className="hover:bg-[#dddddd] cursor-pointer">
                            <NavLink to={`/departments/edit/${props.departmentId}`} className="block p-[8px] text-left">
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span className="ml-3">Sửa</span>
                            </NavLink>
                        </li>
                        <li
                            onClick={props.handleDelete}
                            className="w-full text-left p-[8px] hover:bg-[#dddddd] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <span className="ml-3">Xóa</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mb-3 flex items-center ">
                <p className="w-[120px] font-bold">STT:</p>
                <p className="flex-1 truncate">{props.id}</p>
            </div>
            <div className="mb-3 relative flex items-center group ">
                <p className="w-[120px] font-bold">Tên phòng ban:</p>
                <p title={props.departmentName} className="flex-1 truncate">
                    {props.departmentName}
                </p>
            </div>
            <div className=" mb-3 flex items-center">
                <p className="w-[120px] font-bold">Trạng thái:</p>
                <SwitchButton
                    value={props.activeValue}
                    checked={props.activeChecked}
                    setValue={props.setIsActived}
                    setId={props.setActiveId}
                />
            </div>
            <div className="mb-3 relative group flex items-center">
                <p className="w-[120px] font-bold">Ghi chú:</p>
                <p title={props.note} className="flex-1 truncate">
                    {props.note}
                </p>
            </div>
        </div>
    );
};

export default DepartmentCard;
