const SwitchButton = (props) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={props.checked === true}
                onChange={() => {
                    props.setValue();
                    props.setId();
                }}
                className="sr-only peer"
            />
            <div
                className="
            w-11 
            h-6
            rounded-full
            bg-[#cccccc]
            after:content-['']
            after:absolute
            after:left-[2px]
            after:top-0.5
            after:w-5  
            after:h-5
            after:border-[#cccccc] 
            after:rounded-full 
            after:bg-[#ffffff]
            after:transition-all
            peer
            peer-focus:ring-4
            peer-focus:ring-[#7995e2]
            peer-checked:bg-[#321fdb] 
            peer-checked:after:translate-x-full
            peer-checked:after:border-[#ffffff]
            "
            ></div>
        </label>
    );
};

export default SwitchButton;
