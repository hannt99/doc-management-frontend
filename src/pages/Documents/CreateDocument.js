import { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import InputField from '~/components/InputField';
import FileInput from '~/components/FileInput';
import DropList from '~/components/DropList';
import Select from 'react-select';
import SwitchButton from '~/components/SwitchButton';
import { fullNameValidator, dropListValidator, dateValidator, disabledPastDate } from '~/utils/formValidation';

import FormData from 'form-data';

import { useFetchDepartments, useFetchUsers } from '~/hooks';
import * as documentTypeServices from '~/services/documentTypeServices';
import * as documentServices from '~/services/documentServices';
import * as taskTypeServices from '~/services/taskTypeServices';
import * as taskServices from '~/services/taskServices';
import * as senderServices from '~/services/senderServices';
import * as notificationServices from '~/services/notificationServices';

import Loading from '~/components/Loading';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateDocument = ({ title, inputLabel, path, documentIn, socket }) => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);

    // Input state
    const [fullName, setFullName] = useState('');
    const [number, setNumber] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [code, setCode] = useState('');

    const [allDocTypes, setAllDocTypes] = useState([]);
    // Get all doc types
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType();
            if (res.code === 200) {
                const typeName = res?.data?.map((item) => item?.documentTypeName);
                setAllDocTypes(typeName);
            } else {
                console.log(res);
            }
        };

        fetchApi();
    }, [isSave]);
    const [type, setType] = useState('');
    const [addDocType, setAddDocType] = useState(false);
    const [newDocType, setNewDocType] = useState('');
    // Handle add new doc type
    const handleAddNewDocType = async () => {
        const data = {
            documentTypeName: newDocType,
        };
        const res = await documentTypeServices.createDocumentType(data);
        if (res.code === 200) {
            setNewDocType('');
            setAddDocType(false);
            setIsSave((isSave) => !isSave);
            successNotify(res.message, 1500);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    const [issuedDate, setIssuedDate] = useState('');

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
    }, [isSave]);
    const [sender, setSender] = useState('');
    const [addSender, setAddSender] = useState(false);
    const [newSender, setNewSender] = useState('');
    // Handle add new sender
    const handleAddNewSender = async () => {
        const data = {
            sender: newSender,
        };
        const res = await senderServices.createSender(data);
        if (res.code === 200) {
            setNewSender('');
            setAddSender(false);
            setIsSave((isSave) => !isSave);
            successNotify(res.message, 1500);
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const [level, setLevel] = useState('Bình thường');

    const departments = useFetchDepartments({ isActived: false });
    const [currentLocation, setCurrentLocation] = useState('');

    const [attachFiles, setAttachFiles] = useState([]);
    const [note, setNote] = useState('');
    const [isHaveTask, setIsHaveTask] = useState(true);

    // Input validation state
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isNumberErr, setIsNumberErr] = useState(false);
    const [numberErrMsg, setNumberErrMsg] = useState({});
    const [isSendDateErr, setIsSendDateErr] = useState(false);
    const [sendDateErrMsg, setSendDateErrMsg] = useState({});
    const [isCodeErr, setIsCodeErr] = useState(false);
    const [codeErrMsg, setCodeErrMsg] = useState({});
    const [isIssuedDateErr, setIsIssuedDateErr] = useState(false);
    const [issuedDateErrMsg, setIssuedDateErrMsg] = useState({});
    const [isSenderErr, setIsSenderErr] = useState(false);
    const [senderErrMsg, setSenderErrMsg] = useState({});
    const [isCurrLocationErr, setIsCurrLocationErr] = useState(false);
    const [currLocationErrMsg, setCurrLocationErrMsg] = useState({});

    const { id } = useParams();
    // Get available document data when edit document
    useEffect(() => {
        if (!id) return;

        const fetchApi = async () => {
            const res = await documentServices.getDocumentById(id);
            setFullName(res.data.documentName);
            setNumber(res.data.number);
            setSendDate(res.data.sendDate);
            setCode(res.data.code);
            setType(res.data.type);
            setIssuedDate(res.data.issuedDate);
            setSender(res.data.sender);
            setLevel(res.data.level);
            setCurrentLocation(res.data.currentLocation);
            setNote(res.data.note);
            setIsHaveTask(res.data.isHaveTask);
        };

        fetchApi();
    }, [id]);

    // Task input state
    const [isAssigned, setAssigned] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');

    const [allTaskTypes, setAllTaskTypes] = useState([]);
    // Get all task types
    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskTypeServices.getAllTaskType();
            if (res.code === 200) {
                const typeNames = res?.data?.map((item) => item?.taskType);
                setAllTaskTypes(typeNames);
            } else {
                console.log(res);
            }
        };

        fetchApi();
    }, [isSave]);
    const [taskType, setTaskType] = useState('');
    const [addTaskType, setAddTaskType] = useState(false);
    const [newTaskType, setNewTaskType] = useState('');
    // Handle add new task type
    const handleAddNewTaskType = async () => {
        const data = {
            taskType: newTaskType,
        };
        const res = await taskTypeServices.createTaskType(data);
        if (res.code === 200) {
            setNewTaskType('');
            setAddTaskType(false);
            setIsSave((isSave) => !isSave);
            successNotify(res.message, 1500);
        } else {
            errorNotify(res, 1500);
        }
    };

    const allUsers = useFetchUsers().publicUsers.filter((item) => item?.role === 'Member');
    // Format all users array
    const getUserOptions = () => {
        const options = allUsers?.map((item) => {
            return { value: item._id, label: item.fullName, flag: 'Support' };
        });
        return options;
    };
    const [assignTo, setAssignTo] = useState([]);
    const [leader, setLeader] = useState();
    const [taskDescribe, setTaskDescribe] = useState('');

    // Task input validation state
    const [isTaskNameErr, setIsTaskNameErr] = useState(false);
    const [taskNameErrMsg, setTaskNameErrMsg] = useState({});
    const [isDeadlineErr, setIsDeadlineErr] = useState(false);
    const [deadlineErrMsg, setDeadlineErrMsg] = useState({});
    const [isAssignToErr, setIsAssignToErr] = useState(false);
    const [assignToErrMsg, setAssignToErrMsg] = useState({});
    const [isLeaderErr, setIsLeaderErr] = useState(false);
    const [leaderErrMsg, setLeaderErrMsg] = useState({});

    // Just get id of assigned user
    const getAssignToIds = (assignTo) => {
        const array = assignTo.map((item) => item.value);
        return array;
    };

    // Create user resource for each assigned user
    const setUserResource = () => {
        const options = assignTo?.map((item) => {
            return { userId: item.value, status: 'Chưa nộp', resources: [], isSubmit: false };
        });
        return options;
    };

    // Create or edit document function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isNumberValid = fullNameValidator(number, setIsNumberErr, setNumberErrMsg);
        const isSendDateValid = dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg);
        const isCodeValid = fullNameValidator(code, setIsCodeErr, setCodeErrMsg);
        const isIssuedDateValid = dateValidator(issuedDate, setIsIssuedDateErr, setIssuedDateErrMsg);
        const isSenderValid = fullNameValidator(sender, setIsSenderErr, setSenderErrMsg);
        const isCurrLocationValid = dropListValidator(currentLocation, setIsCurrLocationErr, setCurrLocationErrMsg);
        if (
            !isFullNameValid ||
            !isNumberValid ||
            !isSendDateValid ||
            !isCodeValid ||
            !isIssuedDateValid ||
            !isSenderValid ||
            !isCurrLocationValid
        )
            return;

        const isTaskNameValid = fullNameValidator(taskName, setIsTaskNameErr, setTaskNameErrMsg);
        const isTaskDeadlineValid = dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg);
        const isAssignToValid = dropListValidator(assignTo, setIsAssignToErr, setAssignToErrMsg);
        const isLeaderValid = dropListValidator(leader, setIsLeaderErr, setLeaderErrMsg);
        if (isAssigned) {
            if (!isTaskNameValid || !isTaskDeadlineValid || !isAssignToValid || !isLeaderValid) return;
        }

        setLoading(true);

        const data = {
            documentName: fullName,
            number: number,
            sendDate: sendDate,
            code: code,
            type: type,
            issuedDate: issuedDate,
            sender: sender,
            level: level,
            currentLocation: currentLocation,
            note: note,
            documentIn: documentIn,
            isHaveTask: isAssigned ? true : false,
            assignTo: isAssigned ? assignTo : [],
        };

        let res;
        if (id) {
            res = await documentServices.updateDocument(id, data);
        } else {
            res = await documentServices.createDocument(data);
        }
        if (res.code === 200) {
            if (!attachFiles) {
                setLoading(false);
                successNotify(res.message, 1500);
                navigate(`/documents/${path}`);
            } else {
                const data = new FormData();
                for (let i = 0; i < attachFiles.length; i++) {
                    data.append('myFile', attachFiles[i]);
                }
                await documentServices.uploadFile(res.data._id, data);
                setLoading(false);
                successNotify(res.message, 1500);
                navigate(`/documents/${path}`);
            }
            // ------------------------------------
            if (isAssigned) {
                const taskData = {
                    taskName: taskName,
                    dueDate: deadline,
                    type: taskType,
                    assignTo: assignTo,
                    leader: leader,
                    describe: taskDescribe,
                    level: level,
                    refLink: res.data.documentName,
                    resources: setUserResource(),
                };
                const resTask = await taskServices.createTask(taskData);
                // ------------------------------------
                if (resTask.code === 200) {
                    await documentServices.changeDocumentStatus(res.data._id, { documentStatus: 'Đang xử lý' });
                    if (leader) {
                        const data = {
                            userId: leader.value,
                            flag: 'Leader',
                        };
                        await taskServices.changeAssignRole(resTask.data._id, data);
                    }
                    const newNotiId = await Promise.all(
                        getAssignToIds(resTask.data.assignTo)?.map(async (userId) => {
                            const noti = await notificationServices.createNotification({
                                notification: 'Bạn có nhiệm vụ mới',
                                linkTask: `${process.env.REACT_APP_BASE_URL}/tasks/detail/${resTask.data._id}`,
                                userId: userId,
                            });

                            return { notiId: noti.data._id, userId: noti.data.userId };
                        }),
                    );
                    socket.current?.emit('sendNotification', {
                        senderId: '',
                        text: 'Bạn có nhiệm vụ mới',
                        linkTask: `${process.env.REACT_APP_BASE_URL}/tasks/detail/${resTask.data._id}`,
                        receiverId: getAssignToIds(resTask.data.assignTo),
                        isRead: false,
                        _id: newNotiId,
                    });
                }
                // ------------------------------------
            }
            // ------------------------------------
        } else {
            setLoading(false);
            errorNotify(res, 1500);
        }
    };

    // React-select style
    const selectStyles = {
        placeholder: (base) => ({
            ...base,
            paddingLeft: '8px',
            color: '#000000',
            fontSize: '1.5rem',
            lineHeight: 0,
        }),
        indicatorsContainer: (base) => ({
            ...base,
            display: 'none !important',
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none !important',
        }),
        valueContainer: (base) => ({
            ...base,
            backgroundPosition: 'calc(100% - 12px) center !important',
            background: `url("data:image/svg+xml,<svg height='20' width='20' viewBox='0 0 20 20' aria-hidden='true' class='svg' xmlns='http://www.w3.org/2000/svg'><path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'></path></svg>") no-repeat`,
        }),
        singleValue: (base) => ({
            ...base,
            paddingLeft: '2px',
            fontSize: '1.5rem',
        }),
        menu: (base) => ({
            ...base,
            marginTop: '1px !important',
            borderRadius: 'unset !important',
            padding: '0 !important',
        }),
        menuList: (base) => ({
            ...base,
            borderRadius: 'unset !important',
            padding: '0 !important',
        }),
        option: (base, { isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#2684ff' : '#ffffff',
            padding: '0 16px',
            fontSize: '1.5rem',
            color: isSelected ? '#ffffff' : '#000000',
            ':hover': {
                backgroundColor: '#2684ff',
                color: '#ffffff',
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            padding: '0 16px',
            fontSize: '1.5rem',
        }),
    };

    const navigate = useNavigate();

    return (
        <>
            <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
                <h1 className="text-[2rem] font-bold">{title}</h1>
                <form>
                    <input type="hidden" value={documentIn} />
                    <div className="mt-8">
                        <label className="font-bold">
                            Tên văn bản: <span className="text-red-600">*</span>
                        </label>
                        <InputField
                            id="docName"
                            placeholder="Tên văn bản"
                            value={fullName}
                            setValue={setFullName}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                            className={isFullNameErr ? 'invalid' : 'default'}
                        />
                        <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                    </div>
                    <div className="mt-7 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="font-bold">
                                Số {inputLabel}: <span className="text-red-600">*</span>
                            </label>
                            <InputField
                                id="number"
                                placeholder={`Số ${inputLabel}`}
                                value={number}
                                setValue={setNumber}
                                onBlur={() => fullNameValidator(number, setIsNumberErr, setNumberErrMsg)}
                                className={isNumberErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{numberErrMsg.comeNumber}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">
                                Ngày {inputLabel}: <span className="text-red-600">*</span>
                            </label>
                            <InputField
                                name="date"
                                value={sendDate}
                                setValue={setSendDate}
                                onBlur={() => dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg)}
                                className={isSendDateErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{sendDateErrMsg.inDate}</p>
                        </div>
                    </div>
                    <div className="mt-7 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="font-bold">
                                Số ký hiệu: <span className="text-red-600">*</span>
                            </label>
                            <InputField
                                id="docCode"
                                placeholder="Số ký hiệu"
                                value={code}
                                setValue={setCode}
                                onBlur={() => fullNameValidator(code, setIsCodeErr, setCodeErrMsg)}
                                className={isCodeErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{codeErrMsg.code}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">Loại văn bản:</label>
                            <div className="flex items-center gap-x-3">
                                {!addDocType ? (
                                    <div className="flex-1">
                                        <DropList
                                            options={allDocTypes}
                                            selectedValue={type}
                                            setValue={setType}
                                            setId={() => undefined}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <InputField
                                            id="docType"
                                            placeholder="Loại văn bản"
                                            value={newDocType}
                                            setValue={setNewDocType}
                                            className="default"
                                        />
                                    </div>
                                )}
                                {!newDocType ? (
                                    <div
                                        onClick={() => setAddDocType(!addDocType)}
                                        className="text-[2rem] cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={addDocType ? faXmark : faPlusCircle} />
                                    </div>
                                ) : (
                                    <div onClick={handleAddNewDocType} className="text-[2rem] cursor-pointer">
                                        <FontAwesomeIcon className="text-[blue]" icon={faPlusCircle} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-7 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="font-bold">
                                Ngày ban hành: <span className="text-red-600">*</span>
                            </label>
                            <InputField
                                name="date"
                                value={issuedDate}
                                setValue={setIssuedDate}
                                onBlur={() => dateValidator(issuedDate, setIsIssuedDateErr, setIssuedDateErrMsg)}
                                className={isIssuedDateErr ? 'invalid' : 'default'}
                            />
                            <p className="text-red-600 text-[1.3rem]">{issuedDateErrMsg.issuedDate}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">
                                Nơi ban hành: <span className="text-red-600">*</span>
                            </label>
                            <div className="flex items-center gap-x-3">
                                {!addSender ? (
                                    <div className="flex-1">
                                        <DropList
                                            options={allSenders}
                                            selectedValue={sender}
                                            setValue={setSender}
                                            setId={() => undefined}
                                            isErr={isSenderErr}
                                            onBlur={() => dropListValidator(sender, setIsSenderErr, setSenderErrMsg)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <InputField
                                            id="sender"
                                            placeholder="Nơi ban hành"
                                            value={newSender}
                                            setValue={setNewSender}
                                            className={isSenderErr ? 'invalid' : 'default'}
                                        />
                                    </div>
                                )}
                                {!newSender ? (
                                    <div
                                        onClick={() => setAddSender(!addSender)}
                                        className="text-[2rem] cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={addSender ? faXmark : faPlusCircle} />
                                    </div>
                                ) : (
                                    <div onClick={handleAddNewSender} className="text-[2rem] cursor-pointer">
                                        <FontAwesomeIcon className="text-[blue]" icon={faPlusCircle} />
                                    </div>
                                )}
                            </div>
                            <p className="text-red-600 text-[1.3rem]">{senderErrMsg.sender}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-7">
                        <div className="flex-1">
                            <label className="font-bold">Mức độ:</label>
                            <DropList
                                options={levelOptions}
                                selectedValue={level}
                                setValue={setLevel}
                                setId={() => undefined}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">
                                Ví trí hiện tại: <span className="text-red-600">*</span>
                            </label>
                            <DropList
                                options={departments}
                                selectedValue={currentLocation}
                                setValue={setCurrentLocation}
                                setId={() => undefined}
                                isErr={isCurrLocationErr}
                                onBlur={() =>
                                    dropListValidator(currentLocation, setIsCurrLocationErr, setCurrLocationErrMsg)
                                }
                            />
                            <p className="text-red-600 text-[1.3rem]">{currLocationErrMsg.currLocation}</p>
                        </div>
                    </div>
                    {!id && (
                        <div className="mt-7">
                            <label className="font-bold">File đính kèm:</label>
                            <FileInput setAttachFiles={setAttachFiles} />
                        </div>
                    )}

                    {(title === 'Thêm văn bản đến mới' || (title === 'Sửa văn bản đến' && isHaveTask === false)) && (
                        <div className="mt-7 flex items-center gap-x-5">
                            <label className="font-bold">Giao việc:</label>
                            <SwitchButton
                                checked={isAssigned}
                                setValue={() => setAssigned(!isAssigned)}
                                setId={() => undefined}
                            />
                        </div>
                    )}
                    {isAssigned && (
                        <div className="mt-7 border-[2px] border-dashed border-[#bbbbbb] p-3">
                            <div>
                                <label className="font-bold">
                                    Tên công việc: <span className="text-red-600">*</span>
                                </label>
                                <InputField
                                    id="taskName"
                                    placeholder="Tên công việc"
                                    value={taskName}
                                    setValue={setTaskName}
                                    onBlur={() => fullNameValidator(taskName, setIsTaskNameErr, setTaskNameErrMsg)}
                                    className={isTaskNameErr ? 'invalid' : 'default'}
                                />
                                <p className="text-red-600 text-[1.3rem]">{taskNameErrMsg.fullName}</p>
                            </div>
                            <div className="mt-7 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Ngày đến hạn: <span className="text-red-600">*</span>
                                    </label>
                                    <InputField
                                        name="datetime-local"
                                        value={deadline}
                                        setValue={setDeadline}
                                        min={disabledPastDate()}
                                        onBlur={() => dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg)}
                                        className={isDeadlineErr ? 'invalid' : 'default'}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{deadlineErrMsg.dueDate}</p>
                                </div>
                                <div className="flex-1">
                                    <label className="font-bold">Loại:</label>
                                    <div className="flex items-center gap-x-3">
                                        {!addTaskType ? (
                                            <div className="flex-1">
                                                <DropList
                                                    options={allTaskTypes}
                                                    selectedValue={taskType}
                                                    setValue={setTaskType}
                                                    setId={() => undefined}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <InputField
                                                    id="type"
                                                    placeholder="Loại công việc"
                                                    value={newTaskType}
                                                    setValue={setNewTaskType}
                                                    className="default"
                                                />
                                            </div>
                                        )}
                                        {!newTaskType ? (
                                            <div
                                                onClick={() => setAddTaskType(!addTaskType)}
                                                className="text-[2rem] cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={addTaskType ? faXmark : faPlusCircle} />
                                            </div>
                                        ) : (
                                            <div onClick={handleAddNewTaskType} className="text-[2rem] cursor-pointer">
                                                <FontAwesomeIcon className="text-[blue]" icon={faPlusCircle} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-7 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Nhóm trưởng: <span className="text-red-600">*</span>
                                    </label>
                                    <Select
                                        styles={selectStyles}
                                        placeholder="--Vui lòng chọn--"
                                        options={assignTo}
                                        value={leader}
                                        onChange={setLeader}
                                        onBlur={() => dropListValidator(leader, setIsLeaderErr, setLeaderErrMsg)}
                                        className={isLeaderErr && 'droplistInvalid'}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{leaderErrMsg.leader}</p>
                                </div>
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Người thực hiện: <span className="text-red-600">*</span>
                                    </label>
                                    <Select
                                        styles={selectStyles}
                                        isMulti
                                        placeholder="--Vui lòng chọn--"
                                        options={getUserOptions()}
                                        value={assignTo}
                                        onChange={setAssignTo}
                                        onBlur={() => dropListValidator(assignTo, setIsAssignToErr, setAssignToErrMsg)}
                                        className={isAssignToErr && 'droplistInvalid'}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{assignToErrMsg.assignTo}</p>
                                </div>
                            </div>
                            <div className="mt-7">
                                <label className="font-bold">Mô tả công việc:</label>
                                <InputField
                                    textarea
                                    rows="6"
                                    cols="50"
                                    placeholder="Mô tả công việc"
                                    value={taskDescribe}
                                    setValue={setTaskDescribe}
                                    className="default textarea"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-7">
                        <label className="font-bold">Trích yếu:</label>
                        <InputField
                            textarea
                            rows="6"
                            cols="50"
                            placeholder="Trích yếu"
                            value={note}
                            setValue={setNote}
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
                            to={`/documents/${path}`}
                            className="block mt-4 md:mt-0 w-full md:w-fit rounded-md bg-red-600 hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-center transition-all duration-[1s]"
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

export default CreateDocument;
