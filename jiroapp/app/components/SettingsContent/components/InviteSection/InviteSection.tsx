import { FaCopy, FaLink, FaShieldAlt, FaSync, FaExclamationTriangle, FaUsers, FaQrcode } from 'react-icons/fa';
import styles from './InviteSection.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface InviteSectionProps {
    inviteLink: string;
    onCopyLink: () => void;
    onRefreshLink: () => void;
}

const InviteSection = ({ inviteLink, onCopyLink, onRefreshLink }: InviteSectionProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleCopy = () => {
        onCopyLink();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRefresh = async () => {
        const button = document.querySelector(`.${styles.refreshButton}`);
        if (button) {
            button.classList.add(styles.rotating);
            setTimeout(() => {
                button.classList.remove(styles.rotating);
            }, 1000);
        }
        onRefreshLink();
    };

    return (
        <div className={styles.inviteSection}>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.sectionHeader}
            >
                <h3 className={styles.sectionTitle}>
                    <FaLink className={styles.titleIcon} />
                    Приглашение в проект
                </h3>
                <p className={styles.sectionSubtitle}>
                    Управление доступом к проекту через пригласительные ссылки. Отправьте эту ссылку участникам, чтобы они могли присоединиться к проекту.
                    Ссылка предоставляет полный доступ к проекту.
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.inviteContent}
            >

                <div className={styles.linkSection}>


                    <div className={styles.linkContainer}>
                        <div className={styles.linkDisplay}>
                            <code className={styles.linkText}>{inviteLink}</code>
                        </div>

                        <div className={styles.buttonGroup}>
                            <motion.button
                                type="button"
                                className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
                                onClick={handleCopy}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaCopy className={styles.buttonIcon} />
                                {isCopied ? 'Скопировано!' : 'Копировать'}
                            </motion.button>
                            <motion.button
                                type="button"
                                className={styles.qrButton}
                                onClick={() => setShowQR(!showQR)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaQrcode className={styles.buttonIcon} />
                                QR-код
                            </motion.button>
                            <motion.button
                                type="button"
                                className={styles.refreshButton}
                                onClick={handleRefresh}
                                title="Обновить пригласительную ссылку"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaSync className={styles.buttonIcon} />
                                Обновить
                            </motion.button>
                        </div>
                    </div>

                    {showQR && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={styles.qrContainer}
                        >
                            <div className={styles.qrPlaceholder}>
                                <div className={styles.qrCode}>QR</div>
                                <p className={styles.qrText}>Отсканируйте QR-код для быстрого доступа</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={styles.securityCard}
                >
                    <div className={styles.securityHeader}>
                        <FaShieldAlt className={styles.securityIcon} />
                        <div className={styles.securityTitle}>Безопасность ссылки</div>
                    </div>
                    <div className={styles.securityContent}>
                        <p className={styles.securityText}>
                            <strong>Важно:</strong> Не делитесь ссылкой публично. Каждый, у кого есть эта ссылка, сможет присоединиться к проекту.
                        </p>
                    </div>

                    <div className={styles.warningCard}>
                        <div className={styles.warningHeader}>
                            <FaExclamationTriangle className={styles.warningIcon} />
                            <strong className={styles.warningTitle}>Внимание</strong>
                        </div>
                        <p className={styles.warningText}>
                            При обновлении ссылки старая станет недействительной.
                            Все участники сохранят доступ, но новые приглашения потребуют новой ссылки.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default InviteSection;