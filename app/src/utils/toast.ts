import { toast } from 'react-toastify';

export const showError = (msg: string) => {
  toast.error(msg, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    theme: 'light',
  });
};

export const showSuccess = (msg: string) => {
  toast.success(msg, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    theme: 'light',
  });
};
