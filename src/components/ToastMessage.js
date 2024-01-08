import { toast } from 'react-toastify';

export const successNotify = (msg) =>
    toast.success(msg, {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: 'light',
        theme: 'colored',
    });

export const errorNotify = (msg) =>
    toast.error(msg, {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: 'light',
        theme: 'colored',
    });
