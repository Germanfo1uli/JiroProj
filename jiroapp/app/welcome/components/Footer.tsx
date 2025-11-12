'use client'

import { useState, useEffect } from 'react'
import { FaTasks, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import styles from './Footer.module.css'

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 400)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={styles.footerContainer}>
            <div className={`${styles.footerContent} ${isVisible ? styles.visible : ''}`}>
                <div className={styles.footerMain}>
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <FaTasks className={styles.logoIcon} />
                            <span>TASKFLOW</span>
                        </div>
                        <p className={styles.brandDescription}>
                            Современный менеджер задач, который помогает командам работать эффективнее
                            и достигать большего вместе.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink}>
                                <FaTwitter />
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <FaLinkedin />
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <FaGithub />
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <FaEnvelope />
                            </a>
                        </div>
                    </div>

                    <div className={styles.linksSection}>
                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Продукт</h4>
                            <a href="#" className={styles.footerLink}>Функции</a>
                            <a href="#" className={styles.footerLink}>Интеграции</a>
                            <a href="#" className={styles.footerLink}>Цены</a>
                            <a href="#" className={styles.footerLink}>Обновления</a>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Ресурсы</h4>
                            <a href="#" className={styles.footerLink}>Документация</a>
                            <a href="#" className={styles.footerLink}>Блог</a>
                            <a href="#" className={styles.footerLink}>Форум</a>
                            <a href="#" className={styles.footerLink}>Поддержка</a>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Компания</h4>
                            <a href="#" className={styles.footerLink}>О нас</a>
                            <a href="#" className={styles.footerLink}>Карьера</a>
                            <a href="#" className={styles.footerLink}>Контакты</a>
                            <a href="#" className={styles.footerLink}>Партнеры</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        © 2025 TASKFLOW. Все права защищены котами.
                    </div>
                    <div className={styles.legalLinks}>
                        <a href="#" className={styles.legalLink}>Политика конфиденциальности</a>
                        <a href="#" className={styles.legalLink}>Условия использования</a>
                        <a href="#" className={styles.legalLink}>Cookies</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer