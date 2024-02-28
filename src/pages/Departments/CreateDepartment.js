import { useState, useEffect } from 'react';
import { useParams,useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import { fullNameValidator } from '~/utils/formValidation';
import * as departmentServices from '~/services/departmentServices';
import Loading from '~/components/Loading';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateDepartment = ({ title }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Input state
    const [fullName, setFullName] = useState('');
    const statusList = [
        ['Hoạt động', true],
        ['Không hoạt động', false],
    ];
    const [status, setStatus] = useState(false);
    const [note, setNote] = useState('');

    // Input validation state
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});

    const { id } = useParams();
    // Get available department data when edit department
    useEffect(() => {
        if (!id) return;

        const fetchApi = async () => {
            const res = await departmentServices.getDepartmentById(id);
            setFullName(res.data.departmentName);
            setStatus(res.data.status);
            setNote(res.data.note);
        };

        fetchApi();
    }, [id]);

    // Create or edit document function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        if (!isFullNameValid) return;

        setLoading(true);

        const data = {
            departmentName: fullName,
            status: status,
            note: note,
        };

        let res;
        if (id) {
            res = await departmentServices.updateDepartment(id, data);
        } else {
            res = await departmentServices.createDepartment(data);
        }

        if (res.code === 200) {
            setLoading(false);
            successNotify(res.message, 1500);
            navigate('/departments');
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    return (
        <>
            <div className="shadow-4Way border-t-[3px] border-blue-600 bg-white p-[16px]">
                <h1 className="text-[2rem] font-bold">{title}</h1>
                <form>
                    <div className="mt-8">
                        <label className="font-bold">
                            Tên phòng ban: <span className="text-red-600">*</span>
                        </label>
                        <InputField
                            placeholder="Tên phòng ban"
                            value={fullName}
                            setValue={setFullName}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                            className={isFullNameErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                    </div>
                    <div className="mt-7 flex flex-col md:flex-row md:items-center">
                        <label className="mr-7 font-bold">Trạng thái:</label>
                        <div className="flex items-center">
                            {statusList.map((st, index) => {
                                return (
                                    <div key={index} className="mr-5 flex items-center">
                                        <InputField
                                            name="radio"
                                            checked={status === st[1]}
                                            setValue={() => setStatus(st[1])}
                                            className="w-[15px] h-[15px] flex"
                                        />
                                        <label className="ml-3 text-[1.5rem]">{st[0]}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">Ghi chú:</label>
                        <InputField
                            textarea
                            placeholder="Ghi chú"
                            value={note}
                            setValue={setNote}
                            rows="6"
                            cols="50"
                            className="default textarea"
                        />
                    </div>
                    <div className="mt-12 block md:flex items-center gap-5">
                        <button
                            onClick={handleSubmit}
                            className="w-full md:w-fit rounded-md bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-center transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                        </button>
                        <NavLink
                            to="/departments"
                            className="mt-4 md:mt-0 block w-full md:w-fit rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-center transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                        </NavLink>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[.15] z-[999] flex items-center justify-center">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default CreateDepartment;
