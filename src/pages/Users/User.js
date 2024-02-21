import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faTrashCan,
    faPlusCircle,
    faPenToSquare,
    faAngleLeft,
    faAngleRight,
    faEye,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '~/components/Loading';
import * as userServices from '~/services/userServices';
import { handleCheck, handleCheckAll } from '~/utils/handleCheckbox';
import DropList from '~/components/DropList';
import SwitchButton from '~/components/SwitchButton';
import InputField from '~/components/InputField';
import { useDebounce } from '~/hooks';
import UserDetailCard from '~/components/Card/UserDetailCard';
import UserCard from '~/components/Card/UserCard';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import ConfirmationDialog from '~/components/ConfirmationDialog';

const User = () => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);

    // User state
    const [allUsers, setAllUsers] = useState([]); // all users
    const [userLists, setUserLists] = useState([]); // users with filter and pagination

    const tableHeader = [
        'STT',
        'Họ và tên',
        'Email',
        'Số điện thoại',
        'Phòng ban',
        'Vai trò',
        'Trạng thái',
        'Thao tác',
    ];
    // Pagination state
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const totalPage = Math.ceil(allUsers.length / limit);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);

    const [showUserDetail, setShowUserDetail] = useState(false);
    const [user, setUser] = useState({});

    // Checkbox state
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('userChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAllUser')) || false);

    // Activate user state
    const [activeId, setActiveId] = useState('');
    const [isActived, setIsActived] = useState(false);

    // Change user role state
    const roleOptions = ['Moderator', 'Member'];
    // const roleOptions = [];
    const [roleId, setRoleId] = useState('');
    const [userRole, setUserRole] = useState('');

    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);

    const [deleteId, setDeleteId] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Go to next page
    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + +limit);
        setRowEnd(rowEnd + +limit);
    };

    // Back to previous page
    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - +limit);
        setRowEnd(rowEnd - +limit);
    };

    // Get users from server
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await userServices.getAllUser(page, limit, debouncedValue);
            if (res.code === 200) {
                setLoading(false);
                setAllUsers(res.allUsers); // all users
                setUserLists(res.data); // users with filter and pagination
            } else {
                setLoading(false);
            }
        };

        fetchApi();
    }, [debouncedValue, page, limit, isSave]);

    // Set pagination state to default when have filter
    useEffect(() => {
        if (debouncedValue || limit) {
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
        } else {
            return;
        }
    }, [debouncedValue, limit]);

    // Show user detail card when click
    const handleShowUserDetail = async (id) => {
        setShowUserDetail(true);

        if (!id) return;

        const res = await userServices.getUserById(id);
        if (res.code === 200) {
            setUser(res.data);
        } else {
            return;
        }
    };

    // Activate user function
    useEffect(() => {
        if (!activeId) return;

        const handleActivateUser = async () => {
            const data = {
                isActived: isActived,
            };
            const res = await userServices.activateUser(activeId, data);
            if (res.code === 200) {
                successNotify(res.message, 1500);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res, 1500);
            }
        };

        handleActivateUser();
    }, [activeId, isActived]);

    // Change user role function
    useEffect(() => {
        if (!userRole) return;

        const handleChangeRole = async () => {
            const data = {
                role: userRole,
            };
            const res = await userServices.updateRole(roleId, data);
            if (res.code === 200) {
                successNotify(res.message, 1500);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res, 1500);
            }
        };
        handleChangeRole();
    }, [roleId, userRole]);

    // Save checked list in localStorage
    useEffect(() => {
        localStorage.setItem('userChecked', JSON.stringify(checked));
    }, [checked]);

    // Save checkedAll boolean in localStorage
    useEffect(() => {
        localStorage.setItem('isCheckAllUser', JSON.stringify(checkedAll));
    }, [checkedAll]);

    // Check all rows of users
    useEffect(() => {
        handleCheckAll(checkedAll, checked?.length, allUsers, setChecked);
    }, [checkedAll, checked?.length, allUsers]);

    // Delete one row function
    const handleDelete = async (id) => {
        setDeleteId(id);
        setConfirmationMessage('Bạn có chắc muốn xóa vĩnh viễn người dùng không?');
        setShowConfirmation(true);
    };

    // Delete many rows function
    const handleDeleteMany = async () => {
        setConfirmationMessage('`Bạn có chắc muốn xóa vĩnh viễn những người dùng này không?');
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        setShowConfirmation(false);

        if (deleteId) {
            const res = await userServices.deleteUserById(deleteId);
            if (res.code === 200) {
                successNotify(res.message, 1500);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res, 1500);
            }
            setDeleteId('');
            setConfirmationMessage('');
        } else {
            const data = {
                arrayId: checked,
            };
            const res = await userServices.deleteManyUser(data);
            if (res.code === 200) {
                successNotify(res.message, 1500);
                setChecked([]);
                setPage(1);
                setRowStart(1);
                setRowEnd(0);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res, 1500);
            }
            setConfirmationMessage('');
        }
    };

    const cancelDelete = () => {
        setDeleteId('');
        setShowConfirmation(false);
    };

    return (
        <>
            <div className="mb-5 shadow-4Way bg-white p-[16px]">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative w-full">
                        <InputField
                            placeholder="Tên / Email / Số Điện Thoại"
                            value={searchValue}
                            setValue={setSearchValue}
                            className="default icon"
                        />
                        <div className="absolute left-0 top-[50%] translate-y-[-50%] w-[45px] h-[45px] flex">
                            <FontAwesomeIcon className=" m-auto text-[#a9a9a9]" icon={faSearch} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-[12px] md:mb-0 shadow-4Way border border-solid border-[#cccccc] bg-[#f7f7f7] p-[16px] flex flex-col items-center md:flex-row md:justify-between">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách người dùng</h1>
                <div className=" mt-3 md:mt-0 flex md:flex-col lg:flex-row items-center gap-5">
                    <button
                        onClick={handleDeleteMany}
                        className={
                            checked?.length > 1
                                ? 'w-full lg:w-fit rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s] whitespace-nowrap'
                                : 'hidden'
                        }
                    >
                        <FontAwesomeIcon icon={faTrashCan} /> Xóa <span>({checked?.length})</span> mục
                    </button>
                    <NavLink
                        to="/users/create"
                        className="w-full lg:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                    </NavLink>
                </div>
            </div>
            <div className="bg-white hidden md:flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-[1.4rem] font-light">
                                <thead className="border-b dark:border-neutral-500 font-medium">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checked?.length === allUsers.length}
                                                    onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        {tableHeader?.map((item, index) => {
                                            return (
                                                <th key={index} scope="col" className="whitespace-nowrap px-6 py-4">
                                                    {item}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center p-5">
                                                <Loading />
                                            </td>
                                        </tr>
                                    ) : userLists?.length > 0 ? (
                                        userLists?.map((ul, index) => {
                                            return (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked?.includes(ul?._id)}
                                                                onChange={() =>
                                                                    handleCheck(
                                                                        checked,
                                                                        setChecked,
                                                                        setCheckedAll,
                                                                        ul?._id,
                                                                        allUsers,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        title={ul?.fullName}
                                                        className="whitespace-nowrap max-w-[150px] truncate px-6 py-4"
                                                    >
                                                        {ul?.fullName}
                                                    </td>
                                                    <td
                                                        title={ul?.email}
                                                        className="whitespace-nowrap max-w-[200px] truncate px-6 py-4"
                                                    >
                                                        {ul?.email}
                                                    </td>
                                                    <td title={ul?.phoneNumber} className="whitespace-nowrap px-6 py-4">
                                                        {ul?.phoneNumber}
                                                    </td>
                                                    <td
                                                        title={ul?.department}
                                                        className="whitespace-nowrap max-w-[150px] truncate px-6 py-4"
                                                    >
                                                        {ul?.department}
                                                    </td>
                                                    <td title={ul?.role} className="whitespace-nowrap px-6 py-4">
                                                        <DropList
                                                            options={roleOptions}
                                                            selectedValue={ul?.role}
                                                            setValue={setUserRole}
                                                            setId={() => setRoleId(ul?._id)}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <SwitchButton
                                                                checked={ul?.isActived}
                                                                setValue={() => setIsActived(!ul?.isActived)}
                                                                setId={() => setActiveId(ul?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <div
                                                                onClick={() => handleShowUserDetail(ul?._id)}
                                                                className="w-[30px] h-[30px] rounded-lg bg-blue-600 p-2 hover:text-primary cursor-pointer flex"
                                                            >
                                                                <FontAwesomeIcon
                                                                    className="m-auto"
                                                                    icon={faEye}
                                                                    title="Xem chi tiết"
                                                                />
                                                            </div>
                                                            <NavLink to={`/users/edit/${ul._id}`}>
                                                                <div className="ml-2 w-[30px] h-[30px] rounded-lg bg-green-600 p-2 hover:text-primary cursor-pointer flex">
                                                                    <FontAwesomeIcon
                                                                        className="m-auto"
                                                                        icon={faPenToSquare}
                                                                        title="Chỉnh sửa"
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                onClick={() => handleDelete(ul?._id)}
                                                                className="ml-2 w-[30px] h-[30px] rounded-lg bg-red-600 p-2 hover:text-primary cursor-pointer flex"
                                                            >
                                                                <FontAwesomeIcon
                                                                    className="m-auto"
                                                                    icon={faTrashCan}
                                                                    title="Xoá"
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="p-5 text-center">
                                                Không tìm thấy dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between py-3 mx-5">
                    <div className="flex items-center text-[1.5rem]">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="bg-inherit border border-[#cccccc] text-[1.5rem] rounded-[8px] block w-fit px-[14px] py-[8px] outline-none"
                        >
                            <option value={5}>5 mục</option>
                            <option value={10}>10 mục</option>
                            <option value={100}>100 mục</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <p className="text-[1.5rem] mr-9">
                            Hiển thị <span>{userLists.length === 0 ? 0 : rowStart}</span> đến{' '}
                            <span>{rowEnd + userLists.length}</span> của <span>{allUsers.length}</span> mục
                        </p>
                        <div
                            onClick={handlePrevPage}
                            className={
                                page <= 1 ? 'md-page-btn hover:bg-[#dddddd] disabled' : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <div
                            onClick={handleNextPage}
                            className={
                                page >= totalPage
                                    ? 'md-page-btn hover:bg-[#dddddd] disabled'
                                    : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </div>
            </div>
            {showUserDetail && (
                <UserDetailCard
                    avatar={user?.avatar}
                    email={user?.email}
                    fullName={user?.fullName}
                    gender={user?.gender}
                    birthDate={user?.birthDate}
                    phoneNumber={user?.phoneNumber}
                    role={user?.role}
                    department={user?.department}
                    setShowUserDetail={setShowUserDetail}
                />
            )}
            {showConfirmation && (
                <ConfirmationDialog
                    subject="Xoá người dùng"
                    msg={confirmationMessage}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            <div className="md:hidden">
                <div className="mb-5 flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={checked?.length === allUsers.length}
                            onChange={(e) => setCheckedAll(e.target.checked)}
                        />{' '}
                        <p className="ml-3 mt-1">Chọn tất cả</p>
                    </label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="block w-fit outline-none border border-[#cccccc] rounded-[8px] bg-inherit px-[14px] py-[8px] text-[1.5rem]"
                    >
                        <option value={5}>5 mục</option>
                        <option value={10}>10 mục</option>
                        <option value={100}>100 mục</option>
                    </select>
                </div>
                {loading ? (
                    <div className="p-5 text-center">
                        <Loading />
                    </div>
                ) : userLists?.length > 0 ? (
                    userLists?.map((ul, index) => {
                        return (
                            <UserCard
                                key={index}
                                id={index + 1}
                                handleDetail={() => handleShowUserDetail(ul?._id)}
                                checkBox={checked?.includes(ul?._id)}
                                handleCheckBox={() =>
                                    handleCheck(checked, setChecked, setCheckedAll, ul?._id, allUsers)
                                }
                                userId={ul?._id}
                                handleDelete={() => handleDelete(ul?._id)}
                                fullName={ul?.fullName}
                                email={ul?.email}
                                phone={ul?.phoneNumber}
                                department={ul?.department}
                                roleValue={ul?.role}
                                setRoleValue={setUserRole}
                                setRoleId={() => setRoleId(ul?._id)}
                                activeValue={ul?.isActived}
                                activeChecked={ul?.isActived}
                                setIsActived={() => setIsActived(!ul?.isActived)}
                                setActiveId={() => setActiveId(ul?._id)}
                            />
                        );
                    })
                ) : (
                    <p className="text-center p-5">Không tìm thấy dữ liệu</p>
                )}
                <div className="flex items-center justify-center">
                    <div
                        onClick={handlePrevPage}
                        className={
                            page <= 1 ? 'sm-page-btn hover:bg-[#bbbbbb] disabled' : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        {'< Trước'}
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'sm-page-btn hover:bg-[#bbbbbb] disabled'
                                : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        {'Sau >'}
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
