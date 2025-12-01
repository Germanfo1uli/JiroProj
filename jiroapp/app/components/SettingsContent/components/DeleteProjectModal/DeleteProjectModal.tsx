import { useState, useEffect } from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle, FaLock, FaKey } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DeleteProjectModal.module.css';

interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
}

const DeleteProjectModal = ({ isOpen, onClose, onConfirm, projectName }: DeleteProjectModalProps) => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setGeneratedCode(code);
            setConfirmationCode('');
            setError('');
            setIsDeleting(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (confirmationCode !== generatedCode) {
            setError('Код подтверждения не совпадает');
            return;
        }

        setIsDeleting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            onConfirm();
        } catch (err) {
            setError('Ошибка при удалении проекта');
            setIsDeleting(false);
        }
    };

    const getConsequences = () => [
        'Все задачи проекта будут безвозвратно удалены',
        'Все участники потеряют доступ к проекту',
        'История изменений и аналитика будут удалены',
        'Данные нельзя будет восстановить',
        'Пригласительные ссылки станут недействительными'
    ];

    const getTimeline = () => [
        { time: 'Сразу', action: 'Проект станет недоступен' },
        { time: '24 часа', action: 'Начинается полное удаление данных' },
        { time: '48 часов', action: 'Данные окончательно удаляются с серверов' }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.deleteModal}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={styles.modalContent}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.headerContent}>
                                <div className={styles.headerIconWrapper}>
                                    <FaExclamationTriangle className={styles.headerIcon} />
                                </div>
                                <h2 className={styles.modalTitle}>Удаление проекта</h2>
                                <p className={styles.modalSubtitle}>
                                    Это действие нельзя отменить
                                </p>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                                disabled={isDeleting}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.warningSection}>
                                <div className={styles.warningCard}>
                                    <div className={styles.warningIcon}>
                                        <FaExclamationTriangle />
                                    </div>
                                    <div className={styles.warningContent}>
                                        <h3 className={styles.warningTitle}>
                                            Вы собираетесь удалить проект "{projectName}"
                                        </h3>
                                        <p className={styles.warningText}>
                                            Это приведет к <strong>безвозвратному удалению</strong> всех данных проекта.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.consequencesSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FaLock className={styles.sectionIcon} />
                                    Последствия удаления
                                </h3>
                                <div className={styles.consequencesGrid}>
                                    {getConsequences().map((consequence, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={styles.consequenceItem}
                                        >
                                            <div className={styles.consequenceIcon}>⚠️</div>
                                            <span className={styles.consequenceText}>{consequence}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.timelineSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FaLock className={styles.sectionIcon} />
                                    Таймлайн удаления
                                </h3>
                                <div className={styles.timeline}>
                                    {getTimeline().map((item, index) => (
                                        <div key={index} className={styles.timelineItem}>
                                            <div className={styles.timelineTime}>
                                                <span className={styles.timeBadge}>{item.time}</span>
                                            </div>
                                            <div className={styles.timelineContent}>
                                                <span className={styles.timelineAction}>{item.action}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.confirmationSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FaKey className={styles.sectionIcon} />
                                    Подтверждение удаления
                                </h3>

                                <div className={styles.codeDisplay}>
                                    <div className={styles.codeHeader}>
                                        <span className={styles.codeLabel}>Код подтверждения:</span>
                                        <span className={styles.codeHint}>(введите точно как показано)</span>
                                    </div>
                                    <div className={styles.generatedCode}>
                                        <motion.div
                                            key={generatedCode}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className={styles.codeValue}
                                        >
                                            {generatedCode}
                                        </motion.div>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>
                                        Введите код для подтверждения удаления
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmationCode}
                                        onChange={(e) => {
                                            setConfirmationCode(e.target.value.toUpperCase());
                                            setError('');
                                        }}
                                        placeholder={`Введите "${generatedCode}"`}
                                        className={styles.codeInput}
                                        disabled={isDeleting}
                                        autoFocus
                                    />
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={styles.errorMessage}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </div>

                                <div className={styles.securityCheck}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxInput}
                                            checked={confirmationCode === generatedCode}
                                            readOnly
                                        />
                                        <span className={styles.checkboxCustom} />
                                        <span className={styles.checkboxText}>
                                            Я понимаю, что все данные будут удалены без возможности восстановления
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={isDeleting}
                            >
                                Отмена
                            </button>
                            <motion.button
                                className={`${styles.deleteButton} ${confirmationCode !== generatedCode ? styles.deleteButtonDisabled : ''}`}
                                onClick={handleSubmit}
                                disabled={confirmationCode !== generatedCode || isDeleting}
                                whileHover={confirmationCode === generatedCode && !isDeleting ? { scale: 1.02 } : {}}
                                whileTap={confirmationCode === generatedCode && !isDeleting ? { scale: 0.98 } : {}}
                            >
                                {isDeleting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className={styles.deletingSpinner}
                                        />
                                        Удаление...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className={styles.deleteIcon} />
                                        Удалить проект
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteProjectModal;