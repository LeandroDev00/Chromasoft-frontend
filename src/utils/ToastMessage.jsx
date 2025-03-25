import { toast } from 'react-toastify';

const ToastMessage = {
    ShowSuccess : (message) =>{
        toast.success(message, {
            position: "top-right",
        });
    },

    ShowError: (message) =>{
        toast.error(message, {
            position: "top-right",
        });
    },

    ShowInfo: (message) =>{
        toast.info(message, {
            position: "top-right",
        });
    },

    ShowWarn: (message) =>{
        toast.warn(message, {
            position: "top-right",
        });
    },

    ShowDefault: (message) =>{
        toast(message, {
            position: "top-right",
        });
    }
}

export default ToastMessage