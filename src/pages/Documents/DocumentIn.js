import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilterCircleXmark,
    faPlusCircle,
    faEye,
    faPenToSquare,
    faTrashCan,
    faAngleLeft,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '~/components/Loading';
import * as documentServices from '~/services/documentServices';
import { handleCheck, handleCheckAll } from '~/utils/handleCheckbox';
import { setLevelColor } from '~/utils/setMultiConditions';

import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import DocumentCard from '~/components/Card/DocumentCard';
import * as senderServices from '~/services/senderServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import { useFetchDepartments } from '~/hooks';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const DocumentIn = () => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);

    const userRole = JSON.parse(localStorage.getItem('userRole'));

    const tableHeader = [
        'STT',
        'Số ký hiệu',
        'Tên văn bản',
        'Loại văn bản',
        'Mức độ',
        'Trạng thái',
        'Vị trí hiện tại',
        'Thao tác',
    ];

    // documentIn
    const [allDocuments, setAllDocuments] = useState([]); // all documentIn
    const [documentLists, setDocumentLists] = useState([]); // documentIn with filter and pagination

    // Pagination state
    const [limit, setLimit] = useState(5);
    const totalPage = Math.ceil(allDocuments?.length / limit);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);

    useEffect(() => {
        if (!limit) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [limit]);

    // Go to the next page
    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + +limit);
        setRowEnd(rowEnd + +limit);
    };

    // Back to the previous page
    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - +limit);
        setRowEnd(rowEnd - +limit);
    };

    // Filter input state
    const [fName, setFName] = useState('');
    const [fNote, setFNote] = useState('');
    const [fCode, setFCode] = useState('');
    const [fIssuedDate, setFIssuedDate] = useState('');

    const [allSenders, setAllSenders] = useState([]);
    // Get all senders
    useEffect(() => {
        const fetchApi = async () => {
            const res = await senderServices.getAllSenders();
            if (res.code === 200) {
                const sender = res?.data?.map((item) => item?.sender);
                setAllSenders(sender);
            } else {
                console.log(res);
            }
        };

        fetchApi();
    }, []);
    const [fSender, setFSender] = useState('');

    const [allDocTypes, setAllDocTypes] = useState([]);
    // Get all doc types
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType();
            if (res.code === 200) {
                const typeName = res?.data?.map((item) => item?.documentTypeName);
                setAllDocTypes(typeName);
            } else {
                // console.log(res);
            }
        };

        fetchApi();
    }, []);
    const [fType, setFType] = useState('');

    const [fStatus, setFStatus] = useState('');

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const [fLevel, setFLevel] = useState('');

    // Get all documentIn from server
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await documentServices.getAllDocument(
                page,
                limit,
                true,
                fName,
                fNote,
                fCode,
                fType,
                fIssuedDate,
                fSender,
                fLevel,
                fStatus,
            );
            if (res.code === 200) {
                setAllDocuments(res.allDocumentIn);
                setDocumentLists(res.documents);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchApi();
        // eslint-disable-next-line
    }, [page, limit, isSave]);

    // Checkbox state
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('documentInChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAlldocumentIn')) || false);

    // Save checked list in localStorage
    useEffect(() => {
        localStorage.setItem('documentInChecked', JSON.stringify(checked));
    }, [checked]);

    // Save checkedAll boolean in localStorage
    useEffect(() => {
        localStorage.setItem('isCheckAllDocumentIn', JSON.stringify(checkedAll));
    }, [checkedAll]);

    // Check all rows of documentIn function
    useEffect(() => {
        handleCheckAll(checkedAll, checked?.length, allDocuments, setChecked);
    }, [checkedAll, checked?.length, allDocuments]);

    // Status state of document
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const [statusId, setStatusId] = useState('');
    const [documentStatus, setDocumentStatus] = useState('');

    // Change document status
    useEffect(() => {
        if (!documentStatus) return;

        const handleChangeStatus = async () => {
            const data = {
                documentStatus: documentStatus,
            };
            const res = await documentServices.changeDocumentStatus(statusId, data);
            if (res.code === 200) {
                setIsSave((isSave) => !isSave);
                successNotify(res.message, 1500);
            } else {
                errorNotify(res, 1500);
            }
        };

        handleChangeStatus();
    }, [statusId, documentStatus]);

    // Department state of document
    const departments = useFetchDepartments({ isActived: false });
    const [locationId, setLocationId] = useState('');
    const [documentLocation, setDocumentLocation] = useState('');

    // Change department of document
    useEffect(() => {
        if (!documentLocation) return;
        const handleChangeLocation = async () => {
            const data = {
                documentLocation: documentLocation,
            };
            const res = await documentServices.changeDocumentLocation(locationId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleChangeLocation();
    }, [locationId, documentLocation]);

    // Delete one row function
    const handleDelete = async (id) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn văn bản đến không?`;
        if (!window.confirm(confirmMsg)) return;

        const res = await documentServices.deleteDocumentById(id);
        if (res.code === 200) {
            setIsSave((isSave) => !isSave);
            successNotify(res.message, 1500);
        } else {
            errorNotify(res, 1500);
        }
    };

    // Delete many rows function
    const handleDeleteMany = async () => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn những văn bản này không?`;
        if (!window.confirm(confirmMsg)) return;

        const data = {
            arrayId: checked,
        };
        const res = await documentServices.deleteManyDocument(data);
        if (res.code === 200) {
            setChecked([]);
            setIsSave((isSave) => !isSave);
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
            successNotify(res.message, 1500);
        } else {
            errorNotify(res, 1500);
        }
    };

    // Remove filter function
    const removeFilter = () => {
        setFName('');
        setFNote('');
        setFCode('');
        setFType('');
        setFIssuedDate('');
        setFSender('');
        setFLevel('');
        setFStatus('');
        setIsSave((isSave) => !isSave);
    };

    // Handle filter
    const filter = async () => {
        if (fName || fNote || fCode || fType || fIssuedDate || fSender || fLevel || fStatus) {
            setLoading(true);
            const res = await documentServices.getAllDocument(
                page,
                limit,
                true,
                fName,
                fNote,
                fCode,
                fType,
                fIssuedDate,
                fSender,
                fLevel,
                fStatus,
            );
            if (res.code === 200) {
                setAllDocuments(res.allDocumentIn);
                setDocumentLists(res.documents);
                setPage(1);
                setRowStart(1);
                setRowEnd(0);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } else {
            errorNotify('Hãy chọn ít nhất 1 trường', 1500);
        }
    };

    // isFilter boolean
    const isFilters = () => {
        if (fName || fNote || fCode || fType || fIssuedDate || fSender || fLevel || fStatus) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <div className="mb-5 shadow-4Way bg-white p-[16px]">
                <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <div className="mt-5 flex flex-col md:flex-row gap-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Tên văn bản:</label>
                        <InputField className="default" placeholder="Tên văn bản" value={fName} setValue={setFName} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trích yếu:</label>
                        <InputField className="default" placeholder="Trích yếu" value={fNote} setValue={setFNote} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Số ký hiệu:</label>
                        <InputField className="default" placeholder="Số ký hiệu" value={fCode} setValue={setFCode} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Ngày ban hành:</label>
                        <InputField
                            name="date"
                            className="default leading-[1.3]"
                            value={fIssuedDate}
                            setValue={setFIssuedDate}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Nơi ban hành:</label>
                        <DropList
                            options={allSenders}
                            selectedValue={fSender}
                            setValue={setFSender}
                            setId={() => undefined}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Loại văn bản:</label>
                        <DropList
                            options={allDocTypes}
                            selectedValue={fType}
                            setValue={setFType}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trạng thái:</label>
                        <DropList
                            options={statusOptions}
                            selectedValue={fStatus}
                            setValue={setFStatus}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Mức độ:</label>
                        <DropList
                            options={levelOptions}
                            selectedValue={fLevel}
                            setValue={setFLevel}
                            setId={() => undefined}
                        />
                    </div>
                </div>
                <div className="mt-[20px] flex items-center gap-5">
                    <button
                        onClick={filter}
                        className="w-full rounded-md bg-blue-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s] flex-1"
                    >
                        <FontAwesomeIcon icon={faSearch} /> Tìm kiếm
                    </button>
                    <div className={isFilters() ? 'flex-1' : 'hidden'}>
                        <button
                            onClick={removeFilter}
                            className="w-full rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faFilterCircleXmark} /> Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>
            <div className="mb-[12px] md:mb-0 shadow-4Way border border-solid border-[#cccccc] bg-[#f7f7f7] p-[16px] flex flex-col md:flex-row items-center md:justify-between">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách văn bản đến</h1>
                <div
                    className={
                        userRole === 'Member'
                            ? 'hidden'
                            : 'mt-3 md:mt-0 flex md:flex-col lg:flex-row items-center gap-5'
                    }
                >
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
                        to="/documents/documents-in/create"
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
                                        <th scope="col" className={userRole === 'Member' ? 'hidden' : 'px-6 py-4'}>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checked?.length === allDocuments?.length}
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
                                            <td colSpan={9} className="p-5 text-center">
                                                <Loading />
                                            </td>
                                        </tr>
                                    ) : documentLists?.length !== 0 ? (
                                        documentLists?.map((dcl, index) => {
                                            return (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'hidden'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked?.includes(dcl?._id)}
                                                                onChange={() =>
                                                                    handleCheck(
                                                                        checked,
                                                                        setChecked,
                                                                        setCheckedAll,
                                                                        dcl?._id,
                                                                        allDocuments,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td title={dcl?.code} className="whitespace-nowrap px-6 py-4">
                                                        {dcl?.code}
                                                    </td>
                                                    <td
                                                        title={dcl?.documentName}
                                                        className="max-w-[1px] px-6 py-4 truncate"
                                                    >
                                                        {dcl?.documentName}
                                                    </td>
                                                    <td title={dcl?.type} className="whitespace-nowrap px-6 py-4">
                                                        {dcl?.type}
                                                    </td>
                                                    <td title={dcl?.level} className="whitespace-nowrap px-6 py-4">
                                                        <div className={setLevelColor(dcl?.level)}>{dcl?.level}</div>
                                                    </td>
                                                    <td
                                                        title={dcl?.status}
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'pointer-events-none opacity-50 whitespace-nowrap px-6 py-4'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <DropList
                                                            options={statusOptions}
                                                            selectedValue={dcl?.status}
                                                            setValue={setDocumentStatus}
                                                            setId={() => setStatusId(dcl?._id)}
                                                        />
                                                    </td>
                                                    <td
                                                        title={dcl?.currentLocation}
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'pointer-events-none opacity-50 whitespace-nowrap px-6 py-4'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <DropList
                                                            options={departments}
                                                            selectedValue={dcl?.currentLocation}
                                                            setValue={setDocumentLocation}
                                                            setId={() => setLocationId(dcl?._id)}
                                                        />
                                                    </td>
                                                    <td className="px-2 md:px-6 py-1 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/documents/detail/${dcl?._id}`}>
                                                                <div className="flex w-[30px] h-[30px] bg-blue-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                                    <FontAwesomeIcon className="m-auto" icon={faEye} />
                                                                </div>
                                                            </NavLink>
                                                            <NavLink to={`/documents/documents-in/edit/${dcl?._id}`}>
                                                                <div
                                                                    className={
                                                                        userRole === 'Member'
                                                                            ? 'hidden'
                                                                            : 'ml-2 w-[30px] h-[30px] rounded-lg bg-green-600 p-2 cursor-pointer hover:text-primary flex'
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        className="m-auto"
                                                                        icon={faPenToSquare}
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                onClick={() => handleDelete(dcl?._id)}
                                                                className={
                                                                    userRole === 'Member'
                                                                        ? 'hidden'
                                                                        : 'ml-2 w-[30px] h-[30px] rounded-lg bg-red-600 p-2 cursor-pointer hover:text-primary flex'
                                                                }
                                                            >
                                                                <FontAwesomeIcon className="m-auto" icon={faTrashCan} />
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
                            Hiển thị <span>{documentLists?.length === 0 ? 0 : rowStart}</span> đến{' '}
                            <span>{rowEnd + documentLists?.length}</span> của <span>{allDocuments?.length}</span> mục
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
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-5">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={checked?.length === allDocuments?.length}
                            onChange={(e) => setCheckedAll(e.target.checked)}
                        />{' '}
                        <p className="ml-3 mt-1">Chọn tất cả</p>
                    </label>
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
                {loading ? (
                    <div className="text-center p-5">
                        <Loading />
                    </div>
                ) : documentLists?.length !== 0 ? (
                    documentLists?.map((dcl, index) => {
                        return (
                            <DocumentCard
                                key={index}
                                id={index + 1}
                                documentId={dcl?._id}
                                path="documents-in/edit"
                                code={dcl?.code}
                                docName={dcl?.documentName}
                                type={dcl?.type}
                                level={dcl?.level}
                                levelClass={setLevelColor(dcl?.level)}
                                statusValue={dcl?.status}
                                setStatusValue={setDocumentStatus}
                                setStatusId={() => setStatusId(dcl?._id)}
                                locationValue={dcl?.currentLocation}
                                setLocationValue={setDocumentLocation}
                                setLocationId={() => setLocationId(dcl?._id)}
                                locationOptions={departments}
                                handleDelete={() => handleDelete(dcl?._id)}
                                checkBox={checked?.includes(dcl?._id)}
                                handleCheckBox={() =>
                                    handleCheck(checked, setChecked, setCheckedAll, dcl?._id, allDocuments)
                                }
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
                        Trước
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'sm-page-btn hover:bg-[#bbbbbb] disabled'
                                : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        Sau
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentIn;
