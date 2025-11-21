import { useField } from 'formik';
import { FaCamera, FaTrash } from 'react-icons/fa';
import styles from './AvatarSection.module.css';

interface AvatarSectionProps {
    currentAvatar: string;
}

const AvatarSection = ({ currentAvatar }: AvatarSectionProps) => {
    const [field, meta, helpers] = useField('avatar');

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                helpers.setValue(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.avatarSection}>
            <h3 className={styles.sectionTitle}>Аватар проекта</h3>

            <div className={styles.avatarContent}>
                <div className={styles.avatarPreview}>
                    <img
                        src={field.value || currentAvatar || '/default-avatar.png'}
                        alt="Аватар проекта"
                        className={styles.avatarImage}
                        onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTc1IDU1Qzc1IDU4Ljg2NiA3MS44NjYgNjIgNjggNjJDNjQuMTM0IDYyIDYxIDU4Ljg2NiA2MSA1NUM2MSA1MS4xMzQgNjQuMTM0IDQ4IDY4IDQ4QzcxLjg2NiA0OCA3NSA1MS4xMzQgNzUgNTVaIiBmaWxsPSIjOTRBMUI0Ii8+CjxwYXRoIGQ9Ik0zOCA4NkM0MC43NjE0IDc1LjU1MjIgNDkuOTQ4NyA2OCA2MCA2OEM3MC4wNTEzIDY4IDc5LjIzODYgNzUuNTUyMiA4MiA4NkgzOFoiIGZpbGw9IiM5NEExQjQiLz4KPC9zdmc+';
                        }}
                    />
                    <label htmlFor="avatar-upload" className={styles.uploadOverlay}>
                        <FaCamera className={styles.uploadIcon} />
                        <span>Сменить</span>
                    </label>
                </div>

                <div className={styles.avatarInfo}>
                    <div className={styles.avatarText}>
                        <h4 className={styles.avatarTitle}>Изображение проекта</h4>
                        <p className={styles.avatarDescription}>
                            Загрузите квадратное изображение в формате JPG, PNG или GIF.
                            Рекомендуемый размер: 400×400 пикселей.
                        </p>
                    </div>

                    <div className={styles.avatarControls}>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className={styles.fileInput}
                        />
                        <label htmlFor="avatar-upload" className={styles.uploadButton}>
                            Загрузить изображение
                        </label>

                        {field.value && (
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => helpers.setValue('')}
                            >
                                <FaTrash className={styles.removeIcon} />
                                Удалить
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {meta.touched && meta.error && (
                <div className={styles.error}>{meta.error}</div>
            )}
        </div>
    );
};

export default AvatarSection;