'use client'

import { FaThLarge, FaChartBar, FaCog, FaUsers, FaProjectDiagram, FaHome } from 'react-icons/fa'
import styles from './ControlPanel.module.css'

interface ControlPanelProps {
    activePage: string
    onPageChange: (page: string) => void
    isOpen?: boolean
}

const ControlPanel = ({ activePage, onPageChange, isOpen = true }: ControlPanelProps) => {
    const handleNavClick = (page: string) => {
        onPageChange(page)
    }

    return (
        <div className={`${styles.controlPanel} ${isOpen ? '' : styles.collapsed}`}>
            <div className={styles.projectHeader}>
                <div className={styles.projectAvatar}>
                    <FaProjectDiagram className={styles.projectAvatarIcon} />
                </div>
                <div className={styles.projectInfo}>
                    <h2 className={styles.projectName}>TASKFLOW PRO</h2>
                    <p className={styles.projectDescription}>Система управления задачами</p>
                </div>
            </div>

            <nav className={styles.panelNav}>
                <button
                    className={`${styles.panelNavButton} ${activePage === 'board' ? styles.active : ''}`}
                    onClick={() => handleNavClick('board')}
                >
                    <FaHome className={styles.panelNavIcon} />
                    <span className={styles.panelNavText}>Главная</span>
                </button>

                <button
                    className={`${styles.panelNavButton} ${activePage === 'dashboard' ? styles.active : ''}`}
                    onClick={() => handleNavClick('dashboard')}
                >
                    <FaThLarge className={styles.panelNavIcon} />
                    <span className={styles.panelNavText}>Доска</span>
                </button>

                <button className={styles.panelNavButton}>
                    <FaChartBar className={styles.panelNavIcon} />
                    <span className={styles.panelNavText}>Отчёты</span>
                </button>

                <button
                    className={`${styles.panelNavButton} ${activePage === 'settings' ? styles.active : ''}`}
                    onClick={() => handleNavClick('settings')}
                >
                    <FaCog className={styles.panelNavIcon} />
                    <span className={styles.panelNavText}>Настройки</span>
                </button>

                <button
                    className={`${styles.panelNavButton} ${activePage === 'developers' ? styles.active : ''}`}
                    onClick={() => handleNavClick('developers')}
                >
                    <FaUsers className={styles.panelNavIcon} />
                    <span className={styles.panelNavText}>Разработчики</span>
                </button>
            </nav>
        </div>
    )
}

export default ControlPanel