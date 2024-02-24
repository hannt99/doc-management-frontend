const FileInput = ({ setAttachFiles }) => {
    return (
        <input
            className="block w-full border border-gray-300 rounded-[4px] file:rounded-[4px] bg-gray-50 file:py-[6px] text-gray-900 text-[1.4rem] cursor-pointer"
            id="multiple_files"
            type="file"
            multiple
            name="myFile"
            onChange={(e) => setAttachFiles(e.target.files)}
        />
    );
};

export default FileInput;
