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
} from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import { useDebounce } from '~/hooks';
import SwitchButton from '~/components/SwitchButton';
import { handleCheck, handleCheckAll } from '~/utils/handleCheckbox';
import DepartmentCard from '~/components/Card/DepartmentCard';
import * as departmentServices from '~/services/departmentServices';
import ConfirmationDialog from '~/components/ConfirmationDialog';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import Loading from '~/components/Loading';

const Department = () => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);

    const tableHeader = ['STT', 'Tên phòng ban', 'Trạng thái', 'Ghi chú', 'Thao tác'];

    // Department state
    const [allDepartments, setAllDepartments] = useState([]); // all departments
    const [departmentLists, setDepartmentLists] = useState([]); // departments with filter and pagination

    // Pagination state
    const [limit, setLimit] = useState(5);
    const totalPage = Math.ceil(allDepartments?.length / limit);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);

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

    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);

    // Set pagination state to default when have filter
    useEffect(() => {
        if (limit || debouncedValue) {
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
        } else {
            return;
        }
    }, [limit, debouncedValue]);

    // Get department from server
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await departmentServices.getAllDepartment(limit, page, debouncedValue);
            if (res.code === 200) {
                setAllDepartments(res.allDepartments); // all departments
                setDepartmentLists(res.data); // departments with filter and pagination
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchApi();
    }, [limit, page, debouncedValue, isSave]);

    // Checkbox state
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('departmentChecked')) || []);
    // Save checked list in localStorage
    useEffect(() => {
        localStorage.setItem('departmentChecked', JSON.stringify(checked));
    }, [checked]);

    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAllDepartment')) || false);
    // Save checkedAll boolean in localStorage
    useEffect(() => {
        localStorage.setItem('isCheckAllDepartment', JSON.stringify(checkedAll));
    }, [checkedAll]);

    // Check all rows of departments
    useEffect(() => {
        handleCheckAll(checkedAll, checked?.length, allDepartments, setChecked);
    }, [checkedAll, checked?.length, allDepartments]);

    // Activate department state
    const [activeId, setActiveId] = useState('');
    const [isActived, setIsActived] = useState(false);
    // Activate department function
    useEffect(() => {
        if (!activeId) return;

        const handleActivateDepartment = async () => {
            const data = {
                status: isActived,
            };
            const res = await departmentServices.activateDepartment(activeId, data);
            if (res.code === 200) {
                successNotify(res.message, 1500);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res, 1500);
            }
        };

        handleActivateDepartment();
    }, [activeId, isActived]);

    const [deleteId, setDeleteId] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Delete one row function
    const handleDelete = async (id) => {
        setDeleteId(id);
        setConfirmationMessage('Bạn có chắc muốn xóa vĩnh viễn phòng ban không?');
        setShowConfirmation(true);
    };

    // Delete many rows function
    const handleDeleteMany = async () => {
        setConfirmationMessage('Bạn có chắc muốn xóa vĩnh viễn những phòng ban này không?');
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        setShowConfirmation(false);

        if (deleteId) {
            const res = await departmentServices.deleteDepartmentById(deleteId);
            if (res.code === 200) {
                setDeleteId('');
                setIsSave((isSave) => !isSave);
                successNotify(res.message, 1500);
            } else {
                errorNotify(res, 1500);
            }
            setConfirmationMessage('');
        } else {
            const data = {
                arrayId: checked,
            };
            const res = await departmentServices.deleteManyDepartment(data);
            if (res.code === 200) {
                setChecked([]);
                setPage(1);
                setRowStart(1);
                setRowEnd(0);
                setIsSave((isSave) => !isSave);
                successNotify(res.message, 1500);
            } else {
                errorNotify(res, 1500);
            }
            setConfirmationMessage('');
        }
    };

    const cancelDelete = () => {
        setDeleteId('');
        setShowConfirmation(false);
        setConfirmationMessage('');
    };

    return (
        <>
            <div className="mb-5 shadow-4Way bg-white p-[16px]">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="relative w-full">
                        <InputField
                            placeholder="Tên phòng ban"
                            value={searchValue}
                            setValue={setSearchValue}
                            className="default icon"
                        />
                        <div className="absolute left-0 top-[50%] translate-y-[-50%] w-[45px] h-[45px] flex">
                            <FontAwesomeIcon className="m-auto text-[#a9a9a9]" icon={faSearch} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-[12px] md:mb-0 shadow-4Way border border-solid border-[#cccccc] bg-[#f7f7f7] p-[16px] flex flex-col items-center md:flex-row md:justify-between">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách phòng ban</h1>
                <div className="mt-3 md:mt-0 flex md:flex-col lg:flex-row items-center gap-5">
                    <button
                        onClick={handleDeleteMany}
                        className={
                            checked?.length > 1
                                ? 'w-full lg:w-fit whitespace-nowrap rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s]'
                                : 'hidden'
                        }
                    >
                        <FontAwesomeIcon icon={faTrashCan} /> Xóa <span>({checked?.length})</span> mục
                    </button>
                    <NavLink
                        to="/departments/create"
                        className="w-full lg:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                    </NavLink>
                </div>
            </div>
            <div className="hidden md:flex flex-col shadow-4Way bg-white">
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
                                                    checked={checked?.length === allDepartments?.length}
                                                    onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        {tableHeader?.map((item, index) => {
                                            return (
                                                <th key={index} scope="col" className="px-6 py-4">
                                                    {item}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="p-5 text-center">
                                                <Loading />
                                            </td>
                                        </tr>
                                    ) : departmentLists?.length > 0 ? (
                                        departmentLists?.map((dl, index) => {
                                            return (
                                                <tr key={index} className="border-b">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked?.includes(dl?._id)}
                                                                onChange={() =>
                                                                    handleCheck(
                                                                        checked,
                                                                        setChecked,
                                                                        setCheckedAll,
                                                                        dl?._id,
                                                                        allDepartments,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="max-w-[200px] px-6 py-4 whitespace-nowrap relative group">
                                                        <p title={dl?.departmentName} className="w-[200px] truncate">
                                                            {dl?.departmentName}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <SwitchButton
                                                                checked={dl?.status}
                                                                setValue={() => setIsActived(!dl?.status)}
                                                                setId={() => setActiveId(dl?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap max-w-[200px] px-6 py-4 group">
                                                        <p title={dl?.note} className="w-[200px] truncate">
                                                            {dl?.note}
                                                        </p>
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/departments/edit/${dl?._id}`}>
                                                                <div className="w-[30px] h-[30px] rounded-lg bg-green-600 p-2 hover:text-primary cursor-pointer flex">
                                                                    <FontAwesomeIcon
                                                                        icon={faPenToSquare}
                                                                        title="Chỉnh sửa"
                                                                        className="m-auto"
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                onClick={() => handleDelete(dl?._id)}
                                                                className="ml-2 w-[30px] h-[30px] rounded-lg bg-red-600 p-2 hover:text-primary cursor-pointer flex"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faTrashCan}
                                                                    title="Xoá"
                                                                    className="m-auto"
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
                <div className="mx-5 py-3 flex items-center justify-between">
                    <div className="text-[1.5rem] flex items-center">
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
                    <div className="flex items-center">
                        <p className="mr-9 text-[1.5rem]">
                            Hiển thị <span>{departmentLists?.length === 0 ? 0 : rowStart}</span> đến{' '}
                            <span>{rowEnd + departmentLists?.length}</span> của <span>{allDepartments?.length}</span>{' '}
                            mục
                        </p>
                        <div
                            onClick={handlePrevPage}
                            className={
                                page <= 1
                                    ? 'md-page-btn hover:bg-[#dddddd] disabled cursor-not-allowed'
                                    : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <div
                            onClick={handleNextPage}
                            className={
                                page >= totalPage
                                    ? 'md-page-btn hover:bg-[#dddddd] disabled cursor-not-allowed'
                                    : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <ConfirmationDialog
                    subject="Xoá phòng ban"
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
                            checked={checked?.length === allDepartments?.length}
                            onChange={(e) => setCheckedAll(e.target.checked)}
                        />{' '}
                        <p className="mt-1 ml-3">Chọn tất cả</p>
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
                ) : departmentLists?.length > 0 ? (
                    departmentLists?.map((dl, index) => {
                        return (
                            <DepartmentCard
                                key={index}
                                id={index + 1}
                                checkBox={checked?.includes(dl?._id)}
                                handleCheckBox={() =>
                                    handleCheck(checked, setChecked, setCheckedAll, dl?._id, allDepartments)
                                }
                                departmentId={dl?._id}
                                handleDelete={() => handleDelete(dl?._id)}
                                departmentName={dl?.departmentName}
                                activeValue={dl?.status}
                                activeChecked={dl?.status}
                                setIsActived={() => setIsActived(!dl?.status)}
                                setActiveId={() => setActiveId(dl?._id)}
                                note={dl?.note}
                            />
                        );
                    })
                ) : (
                    <p className="p-5 text-center">Không tìm thấy dữ liệu</p>
                )}

                <div className="flex items-center justify-center gap-2 cursor-pointer">
                    <div
                        onClick={handlePrevPage}
                        className={
                            page <= 1
                                ? 'sm-page-btn hover:bg-[#bbbbbb] disabled cursor-not-allowed'
                                : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        {'< Trước'}
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'sm-page-btn hover:bg-[#bbbbbb] disabled cursor-not-allowed'
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

export default Department;
