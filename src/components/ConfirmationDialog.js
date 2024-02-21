import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const ConfirmationDialog = ({ subject, msg, onConfirm, onCancel }) => {
    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000000]/[.25] z-[999] flex items-center justify-center">
            <div className="bg-[white] w-fit h-fit border-[0] rounded-xl inset-[none] p-0">
                <header className="p-[1.4rem] flex items-center justify-between">
                    <h3 className="text-[1.8rem] md:text-[2.4rem] font-bold">{subject + '?'}</h3>
                    <button
                        className="w-[24px] h-[24px] border-[0] bg-[none] hover:bg-slate-300 p-0 text-[#999] hover:text-black cursor-pointer flex items-center justify-center"
                        onClick={onCancel}
                    >
                        <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faX} />
                    </button>
                </header>
                <hr />
                <main className="p-[1.4rem] text-[#4b4b4b]">{msg}</main>
                <hr />
                <footer className="p-[1.4rem] flex flex-wrap gap-[0.5rem]">
                    <button
                        className="w-full lg:w-fit rounded-xl bg-[#321fdb] hover:bg-[#1b2e4b] px-[16px] py-[8px] text-[white] text-[1.3rem] md:text-[1.6rem] transition-all duration-[0.25s]"
                        onClick={onConfirm}
                    >
                        Đồng ý
                    </button>
                    <button
                        className="w-full lg:w-fit whitespace-nowrap border-[#d1d1d1] border-[0.8px] rounded-xl bg-[none] hover:bg-slate-300 px-[16px] py-[8px] text-[black] text-[1.3rem] md:text-[1.6rem] transition-all duration-[0.25s]"
                        onClick={onCancel}
                    >
                        Huỷ bỏ
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
