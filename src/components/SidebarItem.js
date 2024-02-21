import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

const SidebarItem = (props) => {
    return (
        <li
            className="border-b-[1px] border-[#ffffff]/[0.05] hover:bg-[#46546c] text-[#9fa9ae] hover:text-white text-[1.4rem] cursor-pointer"
            onClick={props.onClick}
        >
            <div className="relative">
                <NavLink
                    to={props.path}
                    className={
                        props.path === '/documents' || props.path === '/statistics' || props.path === '/users'
                            ? ({ isActive }) =>
                                  isActive
                                      ? 'flex items-center py-[18px] pl-[25px] bg-[#46546c] text-white hover:text-white pointer-events-none'
                                      : 'flex items-center py-[18px] pl-[25px]                                                 pointer-events-none'
                            : ({ isActive }) =>
                                  isActive
                                      ? 'flex items-center py-[18px] pl-[25px] bg-[#46546c] text-white hover:text-[white]'
                                      : 'flex items-center py-[18px] pl-[25px]'
                    }
                >
                    <FontAwesomeIcon className="w-[18px] h-[18px] text-[1.8rem]" icon={props.icon} />
                    <span className="ml-6 text-[1.6rem]">{props.title}</span>
                </NavLink>
                {props.firstElement}
            </div>
            {props.secondElement}
        </li>
    );
};

export default SidebarItem;
