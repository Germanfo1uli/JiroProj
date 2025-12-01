'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight, FaTasks, FaChevronDown } from 'react-icons/fa'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import styles from './WelcomePage.module.css'

interface WelcomePageProps {}

const WelcomePage: React.FC<WelcomePageProps> = () => {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)

        if (typeof performance !== 'undefined' && 'mark' in performance) {
            performance.mark('welcome-page-mounted')
        }

        const isFirstVisit = !localStorage.getItem('hasVisitedWelcome')
        if (isFirstVisit) {
            console.log('First time visitor')
        }

        return () => clearTimeout(timer)
    }, [])

    const handleEnter = useCallback(async () => {
        try {
            setIsLoading(true)
            setIsVisible(false)

            await new Promise(resolve => setTimeout(resolve, 600))

            if (typeof performance !== 'undefined') {
                performance.mark('welcome-page-exit')
            }

            localStorage.setItem('hasVisitedWelcome', 'true')

            await router.push('/auth')
        } catch (error) {
            console.error('Navigation error:', error)

            setIsLoading(false)
            setIsVisible(true)
        }
    }, [router])

    const scrollToAbout = useCallback(() => {
        const aboutElement = document.getElementById('about')
        if (aboutElement) {
            aboutElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [])

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            transition: { duration: 0.6 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    }

    const buttonVariants = {
        ...itemVariants,
        hover: {
            scale: 1.02,
            y: -3,
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.98 }
    }

    return (
        <main className={styles.welcomePage}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className={styles.loadingOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        aria-live="polite"
                        aria-label="Загрузка"
                    >
                        <motion.div
                            className={styles.spinner}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <section className={styles.heroSection}>
                <div className={styles.animatedBackground} aria-hidden="true" />

                <motion.div
                    className={styles.contentWrapper}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    exit="exit"
                >
                    <header className={styles.headerSection}>
                        <motion.div
                            className={styles.logo}
                            variants={itemVariants}
                            tabIndex={0}
                            role="banner"
                            aria-label="TaskFlow Logo"
                        >
                            <FaTasks className={styles.logoIcon} aria-hidden="true" />
                            <span>TASKFLOW</span>
                        </motion.div>
                    </header>

                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <motion.h1
                                className={styles.heroTitle}
                                variants={containerVariants}
                                initial="hidden"
                                animate={isVisible ? "visible" : "hidden"}
                                aria-label="Управляйте задачами"
                            >
                                <motion.span
                                    className={`${styles.titleLine} ${styles.titleLine1}`}
                                    variants={itemVariants}
                                >
                                    УПРАВЛЯЙТЕ
                                </motion.span>
                                <motion.span
                                    className={`${styles.titleLine} ${styles.titleLine2}`}
                                    variants={itemVariants}
                                >
                                    ЗАДАЧАМИ
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                className={styles.heroSubtitle}
                                variants={itemVariants}
                            >
                                Современный подход к организации работы.
                                Простота и эффективность в каждом действии.
                            </motion.p>

                            <motion.button
                                className={styles.ctaButton}
                                onClick={handleEnter}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                disabled={isLoading}
                                aria-busy={isLoading}
                                aria-label="Начать работу с TaskFlow"
                            >
                                <span className={styles.buttonText}>Начать работу</span>
                                <FaArrowRight className={styles.buttonIcon} aria-hidden="true" />
                            </motion.button>
                        </div>
                    </div>

                    <motion.button
                        className={styles.scrollIndicator}
                        onClick={scrollToAbout}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        whileHover={{ y: -5 }}
                        aria-label="Узнать больше о TaskFlow"
                    >
                        <FaChevronDown className={styles.scrollIcon} aria-hidden="true" />
                    </motion.button>
                </motion.div>
            </section>

            <section id="about" aria-label="О приложении TaskFlow">
                <AboutSection />
            </section>
            <Footer />
        </main>
    )
}

WelcomePage.displayName = 'WelcomePage'

export default WelcomePage