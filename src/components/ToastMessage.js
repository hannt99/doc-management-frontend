import { toast } from 'react-toastify';

export const successNotify = (msg, l = 2500) =>
    toast.success(msg, {
        position: 'top-center',
        autoClose: l,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        // theme: 'light',
        theme: 'colored',
    });

export const errorNotify = (msg, l = 2500) =>
    toast.error(msg, {
        position: 'top-center',
        autoClose: l,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        // theme: 'light',
        theme: 'colored',
    });
