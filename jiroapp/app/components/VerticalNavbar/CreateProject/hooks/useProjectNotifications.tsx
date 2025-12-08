import toast, { ToastOptions } from 'react-hot-toast';
import { Project } from '../types/types';

interface NotificationOptions extends ToastOptions {
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useProjectNotifications = () => {
    const showSuccess = (project: Project, options?: NotificationOptions) => {
        toast.success(
            (t) => (
                <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🎉</span>
        </div>
        </div>
        <div className="flex-1">
        <p className="font-semibold text-emerald-900">Проект создан!</p>
        <p className="text-sm text-emerald-700 mt-1">{project.name}</p>
            </div>
        {options?.action && (
            <button
                onClick={() => {
            options.action?.onClick();
            toast.dismiss(t.id);
        }}
            className="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                {options.action.label}
                </button>
        )}
        </div>
    ),
        {
            duration: 5000,
                position: 'top-right',
        ...options,
            style: {
            background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #10b981',
                padding: '16px',
                borderRadius: '12px',
        },
        }
    );
    };

    const showError = (message = 'Не удалось создать проект') => {
        toast.error(
            (t) => (
                <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🚫</span>
        </div>
        </div>
        <div className="flex-1">
        <p className="font-semibold text-red-900">Ошибка</p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            </div>
            <button
        onClick={() => toast.dismiss(t.id)}
        className="px-2 py-1 text-red-600 hover:text-red-800 transition-colors"
            >
            ✕
          </button>
          </div>
    ),
        {
            duration: 4000,
                position: 'top-right',
            style: {
            background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #ef4444',
                padding: '16px',
                borderRadius: '12px',
        },
        }
    );
    };

    const showLoading = (message: string) => {
        return toast.loading(
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="font-medium text-slate-700">{message}</span>
            </div>,
        {
            position: 'top-right',
                style: {
            background: '#f8fafc',
                color: '#1e293b',
                padding: '16px',
                borderRadius: '12px',
        },
        }
    );
    };

    const dismiss = (toastId: string) => {
        toast.dismiss(toastId);
    };

    return {
        showSuccess,
        showError,
        showLoading,
        dismiss,
    };
};