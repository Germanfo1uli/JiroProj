'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight, FaTasks } from 'react-icons/fa'
import styles from './WelcomePage.module.css'

const WelcomePage = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const handleEnter = () => {
        setIsVisible(false)
        setTimeout(() => {
            router.push('/auth')
        }, 600)
    }

    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.animatedBackground}>
                <div className={styles.floatingShape1}></div>
                <div className={styles.floatingShape2}></div>
                <div className={styles.floatingShape3}></div>
                <div className={styles.floatingShape4}></div>
                <div className={styles.floatingShape5}></div>
                <div className={styles.floatingShape6}></div>
                <div className={styles.gridPattern}></div>
                <div className={styles.glowEffect1}></div>
                <div className={styles.glowEffect2}></div>
                <div className={styles.particlesContainer}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={styles[`particle${i + 1}`]}></div>
                    ))}
                </div>
                <div className={styles.wave1}></div>
                <div className={styles.wave2}></div>
            </div>

            <div className={`${styles.contentWrapper} ${isVisible ? styles.visible : ''}`}>
                <div className={styles.headerSection}>
                    <div className={styles.logo}>
                        <FaTasks className={styles.logoIcon} />
                        <span>TASKFLOW</span>
                    </div>
                </div>

                <div className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            <span className={`${styles.titleLine} ${styles.titleLine1}`}>УПРАВЛЯЙТЕ</span>
                            <span className={`${styles.titleLine} ${styles.titleLine2}`}>ЗАДАЧАМИ</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Современный подход к организации работы.
                            Простота и эффективность в каждом действии.
                        </p>

                        <button className={styles.ctaButton} onClick={handleEnter}>
                            <span className={styles.buttonText}>Начать работу</span>
                            <FaArrowRight className={styles.buttonIcon} />
                        </button>
                    </div>
                </div>

                <div className={styles.footerSection}>
                    <p>Современный менеджер задач для профессионалов</p>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage