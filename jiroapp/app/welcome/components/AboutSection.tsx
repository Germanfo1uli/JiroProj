'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import {
    FaColumns, FaUsers, FaStickyNote, FaRocket, FaLock, FaSync,
    FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaCheck,
    FaCode, FaChartLine, FaStar, FaServer
} from 'react-icons/fa'
import { HiOutlineLightBulb as LightBulb } from 'react-icons/hi'
import { FiTarget as Target } from 'react-icons/fi'
import { GiAchievement as Achievement } from 'react-icons/gi'
import styles from './AboutSection.module.css'

interface Feature {
    icon: React.ElementType
    title: string
    description: string
    color: string
}

interface GalleryItem {
    title: string
    description: string
    gradient: string
    icon: React.ElementType
    features: string[]
}

interface Advantage {
    icon: React.ElementType
    title: string
    description: string
}

const AboutSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const controls = useAnimation()
    const sectionRef = useRef<HTMLElement>(null)
    const touchStartX = useRef<number | null>(null)

    const features: Feature[] = useMemo(() => [
        {
            icon: FaColumns,
            title: "Интуитивные доски",
            description: "Создавайте и организуйте задачи с помощью гибких досок. Визуализируйте workflow и отслеживайте прогресс в реальном времени.",
            color: "#3b82f6"
        },
        {
            icon: FaUsers,
            title: "Командная работа",
            description: "Работайте вместе с коллегами в реальном времени. Назначайте задачи, оставляйте комментарии и делитесь файлами безопасно.",
            color: "#8b5cf6"
        },
        {
            icon: FaStickyNote,
            title: "Умные заметки",
            description: "Создавайте структурированные заметки с поддержкой markdown. Всегда оставайтесь организованными и ничего не забывайте.",
            color: "#06b6d4"
        },
        {
            icon: FaRocket,
            title: "Мгновенная синхронизация",
            description: "Все изменения сохраняются автоматически. Работайте на любом устройстве без потери данных и задержек.",
            color: "#10b981"
        },
        {
            icon: FaLock,
            title: "Безопасность данных",
            description: "Ваши данные защищены современными методами шифрования. Конфиденциальность — наш первый приоритет.",
            color: "#f59e0b"
        },
        {
            icon: FaSync,
            title: "Гибкая настройка",
            description: "Настройте рабочие процессы под свои нужды. Персонализируйте доски, теги и уведомления в два клика.",
            color: "#ef4444"
        }
    ], [])

    const galleryItems: GalleryItem[] = useMemo(() => [
        {
            title: "Управление проектами",
            description: "Организуйте задачи по проектам и отслеживайте прогресс в реальном времени",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            icon: Target,
            features: ["Визуальное управление", "Отслеживание сроков", "Приоритизация задач"]
        },
        {
            title: "Командное взаимодействие",
            description: "Сотрудничайте с коллегами в реальном времени из любой точки мира",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            icon: FaUsers,
            features: ["Общий доступ к доскам", "Комментарии и обсуждения", "Уведомления о действиях"]
        },
        {
            title: "Аналитика и отчеты",
            description: "Получайте детальную статистику по продуктивности и эффективности",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            icon: FaChartLine,
            features: ["Графики производительности", "Отчеты по проектам", "Прогнозирование сроков"]
        }
    ], [])

    const advantages: Advantage[] = useMemo(() => [
        {
            icon: FaCode,
            title: "Собственная разработка",
            description: "100% отечественный продукт, созданный российскими специалистами с любовью"
        },
        {
            icon: FaServer,
            title: "Серверы в России",
            description: "Все данные хранятся на серверах, расположенных на территории РФ. Полное соответствие 152-ФЗ"
        },
        {
            icon: Achievement,
            title: "Соответствие стандартам",
            description: "Полное соответствие требованиям законодательства РФ и международным стандартам"
        },
        {
            icon: LightBulb,
            title: "Инновационные технологии",
            description: "Передовые технологии с учетом потребностей российского рынка и бизнеса"
        }
    ], [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        controls.start('visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        if (typeof performance !== 'undefined' && 'mark' in performance) {
            performance.mark('about-section-mounted')
        }

        return () => {
            observer.disconnect()
        }
    }, [controls])

    useEffect(() => {
        if (!autoPlay) return

        const handleVisibility = () => {
            setAutoPlay(!document.hidden)
        }

        document.addEventListener('visibilitychange', handleVisibility)

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % features.length)
        }, 4000)

        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [autoPlay, features.length])

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % features.length)
    }, [features.length])

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + features.length) % features.length)
    }, [features.length])

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
            prevSlide()
        } else if (e.key === 'ArrowRight') {
            nextSlide()
        } else if (e.key === 'Escape') {
            setAutoPlay(false)
        }
    }, [prevSlide, nextSlide])

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null) return

        const diff = touchStartX.current - e.changedTouches[0].clientX

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide()
            } else {
                prevSlide()
            }
        }

        touchStartX.current = null
    }, [prevSlide, nextSlide])

    const handleCta = useCallback(async () => {
        try {
            setIsLoading(true)

            await new Promise(resolve => setTimeout(resolve, 500))

            console.log('CTA clicked - ready for navigation')

            setIsLoading(false)
        } catch (error) {
            console.error('CTA error:', error)
            setIsLoading(false)
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
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    const cardVariants = {
        ...itemVariants,
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    }

    return (
        <section
            ref={sectionRef}
            className={styles.aboutContainer}
            aria-labelledby="about-heading"
        >
            <div className={styles.backgroundElements} aria-hidden="true">
                <motion.div
                    className={styles.bgCircle1}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                <motion.div
                    className={styles.bgCircle2}
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                <motion.div
                    className={styles.bgCircle3}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 3, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                <div className={styles.bgGrid} />
            </div>

            <motion.div
                className={styles.aboutContent}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >

                <motion.header className={styles.sectionHeader} variants={itemVariants}>
                    <h3 className={styles.sectionTitle}>
                        Преобразите ваш рабочий процесс
                    </h3>
                    <p className={styles.sectionSubtitle}>
                        TASKFLOW объединяет мощь современных технологий с простотой использования,
                        чтобы вы могли сосредоточиться на самом важном.
                    </p>
                </motion.header>

                <motion.div
                    className={styles.carouselSection}
                    variants={itemVariants}
                    aria-roledescription="carousel"
                    aria-label="Особенности TaskFlow"
                    onKeyDown={handleKeyDown}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.carouselContainer}>
                        <motion.div
                            className={styles.carouselTrack}
                            animate={{ x: `-${currentSlide * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            role="group"
                            aria-live={autoPlay ? 'polite' : 'off'}
                        >
                            {features.map((feature, index) => (
                                <article
                                    key={index}
                                    className={styles.carouselSlide}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} из ${features.length}`}
                                >
                                    <div className={styles.slideContent}>
                                        <motion.div
                                            className={styles.slideIcon}
                                            style={{
                                                backgroundColor: `${feature.color}20`,
                                                color: feature.color,
                                                border: `2px solid ${feature.color}30`
                                            }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 400 }}
                                        >
                                            <feature.icon aria-hidden="true" />
                                        </motion.div>
                                        <h4 className={styles.slideTitle}>{feature.title}</h4>
                                        <p className={styles.slideDescription}>{feature.description}</p>
                                    </div>
                                </article>
                            ))}
                        </motion.div>

                        <div className={styles.carouselControls}>
                            <button
                                className={styles.carouselButton}
                                onClick={prevSlide}
                                aria-label="Предыдущий слайд"
                                disabled={isLoading}
                            >
                                <FaChevronLeft aria-hidden="true" />
                            </button>
                            <button
                                className={styles.carouselButton}
                                onClick={nextSlide}
                                aria-label="Следующий слайд"
                                disabled={isLoading}
                            >
                                <FaChevronRight aria-hidden="true" />
                            </button>
                        </div>

                        <div className={styles.carouselIndicators}>
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Перейти к слайду ${index + 1}`}
                                    aria-current={index === currentSlide ? 'true' : 'false'}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        <button
                            className={styles.autoplayButton}
                            onClick={() => setAutoPlay(!autoPlay)}
                            aria-label={autoPlay ? 'Пауза' : 'Автовоспроизведение'}
                        >
                            {autoPlay ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                </motion.div>

                <motion.section
                    className={styles.statsSection}
                    variants={itemVariants}
                    aria-label="Статистика TaskFlow"
                >
                    {[
                        { number: "99.9%", label: "Время работы" },
                        { number: "10K+", label: "Активных пользователей" },
                        { number: "50+", label: "Интеграций" },
                        { number: "24/7", label: "Поддержка" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className={styles.statItem}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                className={styles.statNumber}
                                initial={{ opacity: 0 }}
                                animate={isVisible ? { opacity: 1 } : {}}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                {stat.number}
                            </motion.div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.section>

                <motion.section
                    className={styles.gallerySection}
                    variants={itemVariants}
                    aria-label="Возможности платформы"
                >
                    <h3 className={styles.galleryTitle}>Возможности платформы</h3>
                    <p className={styles.gallerySubtitle}>
                        Откройте для себя все инструменты, которые помогут вашей команде достигать большего
                    </p>

                    <div className={styles.galleryGrid}>
                        {galleryItems.map((item, index) => (
                            <motion.article
                                key={index}
                                className={styles.galleryItem}
                                variants={cardVariants}
                                whileHover="hover"
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                aria-labelledby={`gallery-title-${index}`}
                            >
                                <div
                                    className={styles.galleryImage}
                                    style={{ background: item.gradient }}
                                    aria-hidden="true"
                                >
                                    <div className={styles.imagePlaceholder}>
                                        <motion.div
                                            className={styles.imageIcon}
                                            animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <item.icon />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {hoveredIndex === index && (
                                            <motion.div
                                                className={styles.galleryOverlay}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className={styles.overlayContent}>
                                                    <h4>{item.title}</h4>
                                                    <p>{item.description}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className={styles.galleryContent}>
                                    <h4
                                        id={`gallery-title-${index}`}
                                        className={styles.galleryItemTitle}
                                    >
                                        {item.title}
                                    </h4>
                                    <p className={styles.galleryItemDescription}>{item.description}</p>

                                    <ul className={styles.featureList}>
                                        {item.features.map((feature, idx) => (
                                            <li key={idx} className={styles.featureItem}>
                                                <FaCheck className={styles.featureIcon} aria-hidden="true" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <motion.button
                                        className={styles.galleryButton}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCta}
                                        disabled={isLoading}
                                    >
                                        Подробнее
                                    </motion.button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    className={styles.domesticSection}
                    variants={itemVariants}
                    aria-label="Отечественная разработка"
                >
                    <header className={styles.domesticHeader}>
                        <h3 className={styles.domesticTitle}>Отечественная разработка</h3>
                        <p className={styles.domesticSubtitle}>
                            TASKFLOW — продукт, созданный в России для российских компаний
                        </p>
                    </header>

                    <div className={styles.domesticGrid}>
                        {advantages.map((advantage, index) => (
                            <motion.div
                                key={index}
                                className={styles.domesticCard}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <motion.div
                                    className={styles.domesticIcon}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <advantage.icon aria-hidden="true" />
                                </motion.div>
                                <h4 className={styles.domesticCardTitle}>{advantage.title}</h4>
                                <p className={styles.domesticCardDescription}>{advantage.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className={styles.domesticBadge}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={styles.badgeContent}>
                            <div className={styles.certificateContainer}>
                                <div className={styles.certificateBorder}>
                                    <div className={styles.certificateInner}>
                                        <FaStar className={styles.certificateIcon} aria-hidden="true" />
                                        <div className={styles.certificateSeal} aria-hidden="true" />
                                        <span className={styles.certificateStamp}>Одобрено</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className={styles.badgeTitle}>Сертификат Антона Владимировича</h4>
                                <p className={styles.badgeText}>Одобрено Милешко Антоном Владимировичем! :)</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                <motion.section
                    className={styles.ctaSection}
                    variants={itemVariants}
                    aria-label="Призыв к действию"
                >
                    <motion.h3
                        className={styles.ctaTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1 }}
                    >
                        Готовы начать?
                    </motion.h3>
                    <motion.p
                        className={styles.ctaDescription}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1.1 }}
                    >
                        Присоединяйтесь к тысячам команд, которые уже используют TASKFLOW для организации своей работы
                    </motion.p>
                    <motion.button
                        className={styles.ctaButton}
                        onClick={handleCta}
                        disabled={isLoading}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.2, type: 'spring' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Начать бесплатно'}
                    </motion.button>
                </motion.section>
            </motion.div>

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
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            role="status"
                            aria-label="Идет загрузка"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

AboutSection.displayName = 'AboutSection'

export default AboutSection