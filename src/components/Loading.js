const Loading = () => {
    return (
        <div
            // className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current  align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            className="inline-block h-10 w-10 border-4 border-solid border-current rounded-full border-r-transparent align-[-0.125em] animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
        >
            <span className="!absolute !w-px !h-px !border-0 !-m-px !p-0 !whitespace-nowrap !overflow-hidden ![clip:rect(0,0,0,0)]">
                Loading...
            </span>
        </div>
    );
};

export default Loading;
