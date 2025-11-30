import { useRef, useState } from 'react';
import { FaUserCircle, FaCamera, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AvatarUpload.module.css';

interface AvatarUploadProps {
    avatar: string | null;
    onAvatarChange: (file: File) => void;
    onAvatarDelete: () => void;
    isLoading: boolean;
}

export const AvatarUpload = ({ avatar, onAvatarChange, onAvatarDelete, isLoading }: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        setFileError(null);

        if (!file.type.startsWith('image/')) {
            setFileError('Пожалуйста, выберите файл изображения');
            return false;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setFileError('Размер файла не должен превышать 5MB');
            return false;
        }

        const minSize = 10 * 1024;
        if (file.size < minSize) {
            setFileError('Файл слишком маленький');
            return false;
        }

        return true;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (validateFile(file)) {
                onAvatarChange(file);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
        setFileError(null);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            if (validateFile(file)) {
                onAvatarChange(file);
            }
        }
    };

    const handleClick = () => {
        setFileError(null);
        fileInputRef.current?.click();
    };

    const handleErrorClose = () => {
        setFileError(null);
    };

    return (
        <div className={styles.avatarUploadContainer}>
            <div
                className={`${styles.avatarUploadArea} ${isDragOver ? styles.dragOver : ''} ${isLoading ? styles.loading : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {avatar ? (
                    <div className={styles.avatarPreview}>
                        <img src={avatar} alt="Аватар" className={styles.avatarImage} />
                        <div className={styles.avatarOverlay}>
                            <FaCamera className={styles.overlayIcon} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        <FaUserCircle className={styles.placeholderIcon} />
                        <span className={styles.placeholderText}>Добавить фото</span>
                    </div>
                )}

                {isLoading && (
                    <div className={styles.avatarLoading}>
                        <div className={styles.loadingSpinner}></div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className={styles.avatarInput}
                />
            </div>

            {fileError && (
                <div className={styles.errorMessage}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <span>{fileError}</span>
                    <button
                        className={styles.errorCloseButton}
                        onClick={handleErrorClose}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};