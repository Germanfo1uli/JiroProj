import { useField } from 'formik';
import { FaCamera, FaTrash, FaUpload, FaImage, FaCheck } from 'react-icons/fa';
import styles from './AvatarSection.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AvatarSectionProps {
    currentAvatar: string;
}

const AvatarSection = ({ currentAvatar }: AvatarSectionProps) => {
    const [field, meta, helpers] = useField('avatar');
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreview(result);
                helpers.setValue(result);
                setIsUploading(false);
            };
            reader.onerror = () => {
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        helpers.setValue('');
        setPreview(null);
    };

    return (
        <div className={styles.avatarSection}>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.sectionHeader}
            >
                <h3 className={styles.sectionTitle}>
                    <FaImage className={styles.titleIcon} />
                    Аватар проекта
                </h3>
                <p className={styles.sectionSubtitle}>
                    Загрузите изображение, которое будет представлять ваш проект
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.avatarContent}
            >
                <motion.div
                    className={styles.avatarPreview}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={styles.avatarContainer}>
                        <img
                            src={field.value || currentAvatar || '/default-avatar.png'}
                            alt="Аватар проекта"
                            className={styles.avatarImage}
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDAiIHgxPSIwIiB5MT0iMCIgeDI9IjEyMCIgeTI9IjEyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjM2Q2YmIzIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzYwYTVmYSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==';
                            }}
                        />
                        {isUploading && (
                            <div className={styles.uploadLoader}>
                                <div className={styles.loaderSpinner} />
                            </div>
                        )}
                        {field.value && !isUploading && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={styles.uploadSuccess}
                            >
                                <FaCheck className={styles.successIcon} />
                            </motion.div>
                        )}
                    </div>

                    <label htmlFor="avatar-upload" className={styles.uploadOverlay}>
                        <div className={styles.uploadContent}>
                            <FaCamera className={styles.uploadIcon} />
                            <span className={styles.uploadText}>Сменить</span>
                        </div>
                    </label>
                </motion.div>

                <div className={styles.avatarInfo}>
                    <div className={styles.avatarText}>
                        <h4 className={styles.avatarTitle}>Изображение проекта</h4>
                        <p className={styles.avatarDescription}>
                            Загрузите квадратное изображение в формате JPG, PNG или WebP.
                            Рекомендуемый размер: 400×400 пикселей. Максимальный размер: 2MB.
                        </p>
                    </div>

                    <div className={styles.avatarControls}>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className={styles.fileInput}
                            disabled={isUploading}
                        />
                        <motion.label
                            htmlFor="avatar-upload"
                            className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isUploading ? (
                                <>
                                    <div className={styles.buttonLoader} />
                                    Загрузка...
                                </>
                            ) : (
                                <>
                                    <FaUpload className={styles.buttonIcon} />
                                    Загрузить изображение
                                </>
                            )}
                        </motion.label>

                        {field.value && (
                            <motion.button
                                type="button"
                                className={styles.removeButton}
                                onClick={handleRemove}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaTrash className={styles.removeIcon} />
                                Удалить
                            </motion.button>
                        )}
                    </div>


                </div>
            </motion.div>

            {meta.touched && meta.error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.error}
                >
                    {meta.error}
                </motion.div>
            )}
        </div>
    );
};

export default AvatarSection;