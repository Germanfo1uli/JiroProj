'use client'

import { FaTasks, FaSearch, FaPlus, FaQuestion, FaUserCircle } from 'react-icons/fa'
import styles from './VerticalNavbar.module.css'

const VerticalNavbar = () => {
    return (
        <div className={styles.verticalNavbar}>
            <div className={styles.navTop}>
                <div className={styles.navLogo}>
                    <FaTasks className={styles.navLogoIcon} />
                </div>

                <div className={styles.navActions}>
                    <button className={styles.navButton} aria-label="Поиск">
                        <FaSearch className={styles.navButtonIcon} />
                    </button>

                    <button className={styles.navButton} aria-label="Создать">
                        <FaPlus className={styles.navButtonIcon} />
                    </button>
                </div>
            </div>

            <div className={styles.navBottom}>
                <button className={styles.navButton} aria-label="Помощь">
                    <FaQuestion className={styles.navButtonIcon} />
                </button>

                <div className={styles.navProfile} aria-label="Профиль пользователя">
                    <div className={styles.profileAvatar}>
                        <FaUserCircle className={styles.avatarIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerticalNavbar