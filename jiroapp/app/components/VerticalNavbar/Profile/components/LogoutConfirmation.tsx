import { FaTimes, FaSignOutAlt } from 'react-icons/fa';
import styles from './LogoutConfirmation.module.css';
import styles2 from '../../CreateProject/CreateProjectModal.module.css';

interface LogoutConfirmationProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }: LogoutConfirmationProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.confirmOverlay} onClick={onCancel}>
            <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.titleText}>
                                <h1 className={styles.modalTitle}>Подтверждение выхода</h1>
                                <p className={styles.modalSubtitle}>Завершение текущей сессии</p>
                            </div>
                        </div>
                        <button className={styles2.closeButton} onClick={onCancel}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.warningMessage}>
                        <h3 className={styles.warningTitle}>Вы собираетесь выйти из системы</h3>
                        <p className={styles.warningText}>
                            После выхода вам потребуется снова ввести логин и пароль для доступа к системе.
                        </p>

                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button
                        className={styles.confirmButton}
                        onClick={onConfirm}
                    >
                        <FaSignOutAlt className={styles.confirmIcon} />
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
        </div>
    );
};