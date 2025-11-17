
import { FaUserCircle, FaTimes, FaCog } from 'react-icons/fa'
import styles from './ProfilePanel.module.css'
import { useRouter } from 'next/navigation'

interface ProfilePanelProps {
    onClose: () => void
}

const ProfileModal = ({ onClose }: ProfilePanelProps) => {
    const router = useRouter()

    const handleSettingsClick = () => {
        router.push('/profile')
    }

    return(
        <div className={styles.profileOverlay} onClick={onClose}>
            <div className={styles.profilePanel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.profileHeader}>
                    <FaUserCircle className={styles.profileAvatar}/>
                    <div className={styles.userInfo}>
                        <p>Имя Фамилия</p>
                        <p className={styles.username}>@username</p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes className={styles.closeIcon} />
                    </button>
                </div>

                <div className={styles.profileSettings}>
                    <button 
                        className={styles.settingButton}
                        onClick={handleSettingsClick}
                    >
                        <FaCog />
                        <p>Настройки</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal;