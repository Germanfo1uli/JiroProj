import { FaCopy, FaLink } from 'react-icons/fa';
import styles from './InviteSection.module.css';

interface InviteSectionProps {
    inviteLink: string;
    onCopyLink: () => void;
}

const InviteSection = ({ inviteLink, onCopyLink }: InviteSectionProps) => {
    return (
        <div className={styles.inviteSection}>
            <h3 className={styles.sectionTitle}>Приглашение в проект</h3>

            <div className={styles.inviteContent}>
                <div className={styles.inviteHeader}>
                    <FaLink className={styles.linkIcon} />
                    <div className={styles.inviteText}>
                        <h4 className={styles.inviteTitle}>Пригласительная ссылка</h4>
                        <p className={styles.inviteDescription}>
                            Отправьте эту ссылку участникам, чтобы они могли присоединиться к проекту
                        </p>
                    </div>
                </div>

                <div className={styles.linkContainer}>
                    <div className={styles.linkDisplay}>
                        <span className={styles.linkText}>{inviteLink}</span>
                    </div>

                    <button
                        type="button"
                        className={styles.copyButton}
                        onClick={onCopyLink}
                    >
                        <FaCopy className={styles.copyIcon} />
                        Копировать
                    </button>
                </div>

                <div className={styles.securityNote}>
                    <strong>Безопасность:</strong> Не делитесь ссылкой публично. Каждый, у кого есть ссылка, сможет присоединиться к проекту.
                </div>
            </div>
        </div>
    );
};

export default InviteSection;