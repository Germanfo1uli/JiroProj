import { useRef, useState } from 'react';
import { FaUserCircle, FaCamera, FaCheck } from 'react-icons/fa';
import styles from './AvatarUpload.module.css';

interface AvatarUploadProps {
    avatar: string | null;
    onAvatarChange: (file: File) => void;
    isLoading: boolean;
}

export const AvatarUpload = ({ avatar, onAvatarChange, isLoading }: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onAvatarChange(file);
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

        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onAvatarChange(file);
        }
    };

    return (
        <div className={styles.avatarUploadContainer}>
            <div
                className={`${styles.avatarUploadArea} ${isDragOver ? styles.dragOver : ''} ${isLoading ? styles.loading : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.avatarInput}
                />
            </div>
        </div>
    );
};