import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 message,
                                 confirmText = 'Подтвердить',
                                 cancelText = 'Отмена'
                             }: ConfirmModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.modalOverlay}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitle}>
                                <FaExclamationTriangle className={styles.warningIcon} />
                                <h3>{title}</h3>
                            </div>
                            <button className={styles.closeButton} onClick={onClose}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p>{message}</p>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={onClose}>
                                {cancelText}
                            </button>
                            <button className={styles.confirmButton} onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};