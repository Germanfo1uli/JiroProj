import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import styles from './Notification.module.css';

interface NotificationProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Notification = ({ message, type = 'success', onClose }: NotificationProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`${styles.notification} ${styles[type]}`}
        >
            <div className={styles.notificationContent}>
                {type === 'success' && <FaCheckCircle className={styles.icon} />}
                {type === 'error' && <FaExclamationCircle className={styles.icon} />}
                {type === 'info' && <FaExclamationCircle className={styles.icon} />}
                <span className={styles.message}>{message}</span>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
                <FaTimes />
            </button>
        </motion.div>
    );
};