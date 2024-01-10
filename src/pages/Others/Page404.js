const Page404 = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <section className="bg-white">
                <div className="max-w-screen-xl mx-auto py-8 px-4 lg:py-16 lg:px-6">
                    <div className="max-w-screen-sm mx-auto text-center">
                        <h1 className="text-[#321fdb] mb-4 text-[7.2rem] md:text-[12rem] font-extrabold leading-[1] tracking-tight">
                            404
                        </h1>
                        <p className="text-gray-900 mb-4 text-[2.6rem] md:text-[4.2rem] font-bold tracking-tight">
                            Đã xảy ra lỗi.
                        </p>
                        <p className="text-gray-500 mb-4 text-[1.5rem] md:text-[1.8rem] font-light">
                            Xin lỗi, chúng tôi không thể tìm thấy trang. Có thể trang bạn tìm đã bị xóa hoặc không tồn
                            tại.{' '}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page404;
