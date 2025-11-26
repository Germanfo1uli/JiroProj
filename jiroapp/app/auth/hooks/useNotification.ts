import toast from 'react-hot-toast';

export const useNotification = () => {
    const showSuccess = (message: string) => {
        toast.success(message);
    };

    const showError = (message: string) => {
        toast.error(message);
    };

    const showLoading = (message: string) => {
        return toast.loading(message);
    };

    const dismissToast = (toastId: string) => {
        toast.dismiss(toastId);
    };

    const updateToast = (toastId: string, type: 'success' | 'error' | 'loading', message: string) => {
        toast.dismiss(toastId);
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        } else {
            toast.loading(message);
        }
    };

    return {
        showSuccess,
        showError,
        showLoading,
        dismissToast,
        updateToast,
    };
};