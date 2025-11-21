import { FaCopy, FaLink, FaShieldAlt, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import styles from './InviteSection.module.css';

interface InviteSectionProps {
    inviteLink: string;
    onCopyLink: () => void;
    onRefreshLink: () => void;
}

const InviteSection = ({ inviteLink, onCopyLink, onRefreshLink }: InviteSectionProps) => {
    return (
        <div className={styles.inviteSection}>
            <h3 className={styles.sectionTitle}>Приглашение в проект</h3>

            <div className={styles.inviteContent}>
                <div className={styles.inviteHeader}>
                    <div className={styles.inviteIcon}>
                        <FaLink />
                    </div>
                    <div className={styles.inviteText}>
                        <h4 className={styles.inviteTitle}>Пригласительная ссылка</h4>
                        <p className={styles.inviteDescription}>
                            Отправьте эту ссылку участникам, чтобы они могли присоединиться к проекту.
                            Ссылка предоставляет полный доступ к проекту.
                        </p>
                    </div>
                </div>

                <div className={styles.linkContainer}>
                    <div className={styles.linkDisplay}>
                        <span className={styles.linkText}>{inviteLink}</span>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.copyButton}
                            onClick={onCopyLink}
                        >
                            <FaCopy className={styles.buttonIcon} />
                            Копировать
                        </button>
                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={onRefreshLink}
                            title="Обновить пригласительную ссылку"
                        >
                            <FaSync className={styles.buttonIcon} />
                        </button>
                    </div>
                </div>

                <div className={styles.securityNote}>
                    <FaShieldAlt className={styles.securityIcon} />
                    <div className={styles.securityText}>
                        <strong>Безопасность ссылки</strong>
                        <p>Не делитесь ссылкой публично. Каждый, у кого есть эта ссылка, сможет присоединиться к проекту.</p>

                        <div className={styles.warningNote}>
                            <div className={styles.warningHeader}>
                                <FaExclamationTriangle className={styles.warningIcon} />
                                <strong>Внимание</strong>
                            </div>
                            <p className={styles.warningText}>
                                При обновлении ссылки старая станет недействительной.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteSection;