import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';

// Validate name
export const fullNameValidator = (fullName, setIsFullNameErr, setFullNameErrMsg) => {
    const msg = {};
    if (isEmpty(fullName)) {
        msg.fullName = 'Tên không được để trống!';
        msg.comeNumber = 'Số đến không được để trống!';
        msg.code = 'Số ký hiệu không được để trống!';
        msg.sender = 'Nơi ban hành không được để trống!';
        setIsFullNameErr(true);
    } else {
        setIsFullNameErr(false);
    }
    setFullNameErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

// Validate email
export const emailValidator = (email, setIsEmailErr, setEmailErrMsg) => {
    const msg = {};
    if (isEmpty(email)) {
        msg.email = 'Email không được để trống!';
        setIsEmailErr(true);
    } else if (!isEmail(email)) {
        msg.email = 'Email không hợp lệ';
        setIsEmailErr(true);
    } else {
        setIsEmailErr(false);
    }
    setEmailErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const PasswordValidator = class {
    // constructor() {
    //     // Constructor or initialization if needed
    // }

    // Validator for sign-in context
    validate(password, setIsPasswordErr, setPasswordErrMsg) {
        // Validation logic specific to sign-in (e.g., minimum length, special characters, etc.)
        // Create an object with validation details and call a callback function with this object
        // Return true or false
        const errMsg = {};
        if (!password) {
            errMsg.password = 'Mật khẩu không được để trống!';
        } else if (password.length < 6) {
            errMsg.password = 'Mật khẩu phải có ít nhất 6 kí tự!';
        }

        setPasswordErrMsg(errMsg);
        if (Object.keys(errMsg).length > 0) {
            setIsPasswordErr(true);
            return true;
        }
        return false;
    }

    // Validator for resetting password context
    validateResetPassword(newPassword, confirmPassword, setIsPasswordErr, setPasswordErrMsg) {
        // Validation logic specific to resetting password
        // Create an object with validation details and call a callback function with this object
        // Return true or false
        const errMsg = {};
        if (!newPassword) {
            errMsg.password = 'Mật khẩu mới không được để trống!';
        } else if (newPassword.length < 6) {
            errMsg.password = 'Mật khẩu mới phải có ít nhất 6 kí tự!';
        } else if (confirmPassword !== newPassword) {
            errMsg.confirmPassword = 'Xác nhận mật khẩu không trùng khớp!';
        }

        setPasswordErrMsg(errMsg);
        if (Object.keys(errMsg).length > 0) {
            setIsPasswordErr(true);
            return true;
        }
        return false;
    }

    // Validator for changing password context
    // validateChangePassword(oldPassword, newPassword, setIsPasswordErr, setPasswordErrMsg) {
        // Validation logic specific to changing password (e.g., comparison, strength, etc.)
        // Create an object with validation details and call a callback function with this object
        // Return true or false
        // currently incorrect :((
        // const errMsg = {};
        // if (!oldPassword) {
        //     errMsg.oldPassword = 'Mật khẩu cũ không được để trống!';
        // } else if (oldPassword.length < 6) {
        //     errMsg.oldPassword = 'Mật khẩu cũ phải có ít nhất 6 kí tự!';
        // } if (!newPassword) {
        //     errMsg.newPassword = 'Mật khẩu mới không được để trống!';
        // } else if (newPassword.length < 6) {
        //     errMsg.newPassword = 'Mật khẩu mới phải có ít nhất 6 kí tự!';
        // } 

        // setPasswordErrMsg(errMsg);
        // if (Object.keys(errMsg).length > 0) {
        //     setIsPasswordErr(true);
        //     return true;
        // }
        // return false;
    // }
};

// Validate password
// export const passwordValidator = (password, confirmPassword, setIsPasswordErr, setPasswordErrMsg) => {
//     const msg = {};
//     if (isEmpty(password)) {
//         msg.password = 'Mật khẩu không được để trống!';
//         msg.confirmPassword = 'Xác nhận mật khẩu không được để trống!';
//         msg.oldPassword = 'Mật khẩu cũ không được để trống!';
//         msg.newPassword = 'Mật khẩu mới không được để trống!';
//         setIsPasswordErr(true);
//     } else if (password.length < 6) {
//         msg.password = 'Mật khẩu phải có ít nhất 6 kí tự!';
//         msg.confirmPassword = 'Xác nhận mật khẩu phải có ít nhất 6 kí tự!';
//         msg.oldPassword = 'Mật khẩu cũ phải có ít nhất 6 kí tự!';
//         msg.newPassword = 'Mật khẩu mới phải có ít nhất 6 kí tự!';
//         setIsPasswordErr(true);
//     } else if (confirmPassword !== password) {
//         msg.confirmPassword = 'Xác nhận mật khẩu không trùng khớp!';
//         setIsPasswordErr(true);
//     } else {
//         setIsPasswordErr(false);
//     }
//     setPasswordErrMsg(msg);
//     if (Object.keys(msg).length > 0) return false;
//     return true;
// };

// Validate date
export const disabledPastDate = () => {
    let today, dd, mm, yyyy, hh, minu;
    today = new Date();
    dd = ('0' + today.getDate()).slice(-2);
    mm = ('0' + (today.getMonth() + 1)).slice(-2);
    yyyy = today.getFullYear();
    hh = ('0' + today.getHours()).slice(-2);
    minu = ('0' + today.getMinutes()).slice(-2);
    return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + minu;
};

export const dateValidator = (date, setIsDateErr, setDateErrMsg) => {
    const msg = {};
    if (isEmpty(date)) {
        msg.date = 'Thời gian không được để trống!';
        msg.issuedDate = 'Ngày ban hành không được để trống!';
        msg.inDate = 'Ngày đến không được để trống!';
        msg.dueDate = 'Ngày đến hạn không được để trống!';
        msg.outDate = 'Ngày đi không được để trống!';
        setIsDateErr(true);
    } else {
        setIsDateErr(false);
    }
    setDateErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};

export const dropListValidator = (value, setIsDropListErr, setDropListErrMsg) => {
    const msg = {};
    if (!value || value.length === 0) {
        msg.department = 'Phòng ban không được để trống!';
        msg.sender = 'Nơi ban hành không được để trống!';
        msg.currLocation = 'Vị trí hiện tại không được để trống!';
        msg.leader = 'Nhóm trưởng không được để trống!';
        msg.assignTo = 'Người thực hiện không được để trống!';
        setIsDropListErr(true);
    } else {
        setIsDropListErr(false);
    }
    setDropListErrMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
};
