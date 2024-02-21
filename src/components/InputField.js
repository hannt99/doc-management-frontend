import { useState } from 'react';
import { eye, eyeHover, eyeSlash, eyeSlashHover } from '~/custom-svg-icons/index';

const InputField = (props) => {
    const [isHoveredEyeIcon, setIsHoveredEyeIcon] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseEnterEyeIcon = () => {
        setIsHoveredEyeIcon(true);
    };

    const handleMouseLeaveEyeIcon = () => {
        setIsHoveredEyeIcon(false);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    let Comp = 'input';
    if (props.textarea) {
        Comp = 'textarea';
    }

    const setTypes = () => {
        const inputName = props.name;
        switch (inputName) {
            case 'email':
                return 'email';
            case 'password':
                return !showPassword ? 'password' : 'text';
            case 'date':
                return 'date';
            case 'datetime-local':
                return 'datetime-local';
            case 'radio':
                return 'radio';
            default:
                return 'text';
        }
    };

    return (
        <div className="relative rounded-md">
            <Comp
                placeholder={props.placeholder}
                id={props.id}
                type={setTypes()}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                autoComplete="on"
                onBlur={props.onBlur}
                checked={props.checked}
                rows={props.rows}
                cols={props.cols}
                min={props.min}
                className={props.className}
            />
            <div
                onClick={toggleShowPassword}
                className={props.name === 'password' ? 'absolute top-0 right-0 p-[7px] cursor-pointer' : 'hidden'}
            >
                <img
                    src={
                        !showPassword
                            ? isHoveredEyeIcon
                                ? eyeHover
                                : eye
                            : isHoveredEyeIcon
                            ? eyeSlashHover
                            : eyeSlash
                    }
                    alt="Eye Icon"
                    title={!showPassword ? 'Eye' : 'Hidden'}
                    onMouseEnter={handleMouseEnterEyeIcon}
                    onMouseLeave={handleMouseLeaveEyeIcon}
                />
            </div>
        </div>
    );
};

export default InputField;
