const DropList = ({ options, selectedValue, setValue, setId, isErr, onBlur }) => {
    return (
        <select
            value={selectedValue}
            onChange={(e) => {
                setValue(e.target.value);
                setId();
            }}
            className={
                isErr
                    ? 'block w-full h-[38px] outline-[#2684ff] border border-[red]     rounded-[4px] bg-inherit text-[1.5rem] leading-[1.2] truncate appearance-none drop-list'
                    : 'block w-full h-[38px] outline-[#2684ff] border border-[#cccccc] rounded-[4px] bg-inherit text-[1.5rem] leading-[1.2] truncate appearance-none drop-list'
            }
            onBlur={onBlur}
        >
            <option value="" disabled hidden>
                --Vui lòng chọn--
            </option>
            {options?.length === 0 ? (
                <option className="text-[#bbbbbb] text-center" value="" disabled>
                    No options
                </option>
            ) : (
                options?.map((option, index) => {
                    return (
                        <option key={index} title={option} value={option}>
                            {option}
                        </option>
                    );
                })
            )}
        </select>
    );
};

export default DropList;
