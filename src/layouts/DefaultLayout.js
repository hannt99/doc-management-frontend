import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const DefaultLayout = ({ children, socket }) => {
    const [toggleSidebar, setToggleSidebar] = useState(false);

    return (
        <div className="">
            <div
                // sidebar
                className={
                    toggleSidebar
                        ? 'fixed top-0 bottom-0 left-0                 w-[256px] h-screen shadow-right z-30 transition-all duration-[1s]'
                        : 'fixed top-0 bottom-0 left-[-100%] xl:left-0 w-[256px] h-screen shadow-right z-30 transition-all duration-[1s]'
                }
            >
                <Sidebar />
            </div>
            <div
                // right of sidebar
                className={
                    toggleSidebar
                        ? 'h-screen pl-0 xl:pl-[256px] transition-all duration-[1s]'
                        : 'h-screen pl-0 xl:pl-[256px] transition-all duration-[1s]'
                }
            >
                <div
                    className={
                        // header
                        toggleSidebar
                            ? 'fixed top-0 left-[256px]                 right-0 transition-all duration-[1s] z-30'
                            : 'fixed top-0 left-0       xl:left-[256px] right-0 transition-all duration-[1s] z-30'
                    }
                >
                    <Header setToggle={setToggleSidebar} socket={socket} />
                </div>
                {/* main */}
                <div className="h-full pt-[64px] flex flex-col">
                    {/* body */}
                    <div className="flex-1 bg-[#ebedef] p-[16px]">{children}</div>
                    {/* footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
