'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaTasks, FaTwitter, FaLinkedin, FaGithub, FaEnvelope,
    FaExternalLinkAlt, FaSpinner
} from 'react-icons/fa'
import styles from './Footer.module.css'

const socialLinks = [
    { href: '#', Icon: FaTwitter, label: 'Twitter' },
    { href: '#', Icon: FaLinkedin, label: 'LinkedIn' },
    { href: '#', Icon: FaGithub, label: 'GitHub' },
    { href: '#', Icon: FaEnvelope, label: 'Email' }
]

const navLinks = [
    {
        title: 'Продукт',
        links: [
            { href: '#', label: 'Функции' },
            { href: '#', label: 'Интеграции' },
            { href: '#', label: 'Цены' },
            { href: '#', label: 'Обновления' }
        ]
    },
    {
        title: 'Ресурсы',
        links: [
            { href: '#', label: 'Документация' },
            { href: '#', label: 'Блог' },
            { href: '#', label: 'Форум' },
            { href: '#', label: 'Поддержка' }
        ]
    },
    {
        title: 'Компания',
        links: [
            { href: '#', label: 'О нас' },
            { href: '#', label: 'Карьера' },
            { href: '#', label: 'Контакты' },
            { href: '#', label: 'Партнеры' }
        ]
    }
]

const Footer: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState<string | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300)
        return () => clearTimeout(timer)
    }, [])

    const handleLinkClick = useCallback((href: string, label: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        setIsLoading(label)

        setTimeout(() => {
            setIsLoading(null)
            console.log(`Navigate to: ${href}`)
        }, 600)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const brandVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    const navVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    const bottomVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, delay: 0.4 }
        }
    }

    return (
        <footer className={styles.footerContainer}>
            <motion.div
                className={styles.footerContent}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                <motion.div
                    className={styles.footerMain}
                    role="contentinfo"
                >
                    <motion.div
                        className={styles.brandSection}
                        variants={brandVariants}
                    >
                        <div className={styles.logo} aria-label="TaskFlow logo">
                            <FaTasks className={styles.logoIcon} />
                            <span>TASKFLOW</span>
                        </div>

                        <p className={styles.brandDescription}>
                            Современный менеджер задач, который помогает командам работать эффективнее
                            и достигать большего вместе. Создано в России — для российских компаний.
                        </p>

                        <motion.div className={styles.socialLinks}>
                            {socialLinks.map(({ href, Icon, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    className={styles.socialLink}
                                    aria-label={label}
                                    title={label}
                                    onClick={handleLinkClick(href, label)}
                                    whileHover={{ scale: 1.15, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                >
                                    {isLoading === label ? (
                                        <FaSpinner className={styles.spinnerIcon} />
                                    ) : (
                                        <Icon />
                                    )}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={styles.linksSection}
                        variants={navVariants}
                    >
                        <nav className={styles.navGrid} aria-label="Footer navigation">
                            {navLinks.map((group) => (
                                <motion.div
                                    key={group.title}
                                    className={styles.linkGroup}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                >
                                    <h3 className={styles.linkGroupTitle}>
                                        {group.title}
                                    </h3>
                                    {group.links.map(({ href, label }) => (
                                        <motion.a
                                            key={label}
                                            href={href}
                                            className={styles.footerLink}
                                            onClick={handleLinkClick(href, label)}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            aria-label={label}
                                        >
                                            {label}
                                            <FaExternalLinkAlt className={styles.linkArrow} />
                                        </motion.a>
                                    ))}
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.footerBottom}
                    variants={bottomVariants}
                >
                    <div className={styles.copyright}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            © 2025 TASKFLOW. Все права защищены котами.
                        </motion.span>
                    </div>

                    <div className={styles.legalLinks}>
                        {[
                            { href: '#', label: 'Политика конфиденциальности' },
                            { href: '#', label: 'Условия использования' },
                            { href: '#', label: 'Cookies' }
                        ].map(({ href, label }) => (
                            <motion.a
                                key={label}
                                href={href}
                                className={styles.legalLink}
                                onClick={handleLinkClick(href, label)}
                                whileHover={{ opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {label}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className={styles.loadingIndicator}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        aria-live="polite"
                        aria-label={`Загрузка ${isLoading}`}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <FaSpinner />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    )
}

Footer.displayName = 'Footer'
export default Footer