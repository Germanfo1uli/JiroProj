'use client'

import { useState, useEffect } from 'react'
import { FaColumns, FaUsers, FaStickyNote, FaRocket, FaLock, FaSync, FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaCheck, FaStar, FaCode, FaServer, FaChartLine, FaPlug, FaCertificate } from 'react-icons/fa'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { FiTarget } from 'react-icons/fi'
import { GiAchievement } from 'react-icons/gi'
import styles from './AboutSection.module.css'

const AboutSection = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const features = [
        {
            icon: FaColumns,
            title: "Интуитивные доски",
            description: "Создавайте и организуйте задачи с помощью гибких досок. Визуализируйте workflow и отслеживайте прогресс.",
            color: "#3b82f6"
        },
        {
            icon: FaUsers,
            title: "Командная работа",
            description: "Работайте вместе с коллегами в реальном времени. Назначайте задачи, оставляйте комментарии и делитесь файлами.",
            color: "#8b5cf6"
        },
        {
            icon: FaStickyNote,
            title: "Умные заметки",
            description: "Создавайте структурированные заметки с поддержкой markdown. Всегда оставайтесь организованными.",
            color: "#06b6d4"
        },
        {
            icon: FaRocket,
            title: "Мгновенная синхронизация",
            description: "Все изменения сохраняются автоматически. Работайте на любом устройстве без потери данных.",
            color: "#10b981"
        },
        {
            icon: FaLock,
            title: "Безопасность данных",
            description: "Ваши данные защищены современными методами шифрования. Конфиденциальность — наш приоритет.",
            color: "#f59e0b"
        },
        {
            icon: FaSync,
            title: "Гибкая настройка",
            description: "Настройте рабочие процессы под свои нужды. Персонализируйте доски, теги и уведомления.",
            color: "#ef4444"
        }
    ]

    const galleryItems = [
        {
            title: "Управление проектами",
            description: "Организуйте задачи по проектам и отслеживайте прогресс",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            icon: FiTarget,
            features: ["Визуальное управление", "Отслеживание сроков", "Приоритизация задач"]
        },
        {
            title: "Командное взаимодействие",
            description: "Сотрудничайте с коллегами в реальном времени",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            icon: FaUsers,
            features: ["Общий доступ к доскам", "Комментарии и обсуждения", "Уведомления о действиях"]
        },
        {
            title: "Аналитика и отчеты",
            description: "Получайте детальную статистику по продуктивности",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            icon: FaChartLine,
            features: ["Графики производительности", "Отчеты по проектам", "Прогнозирование сроков"]
        },
    ]

    const advantages = [
        {
            icon: FaCode,
            title: "Собственная разработка",
            description: "100% отечественный продукт, созданный российскими специалистами"
        },
        {
            icon: FaServer,
            title: "Серверы в России",
            description: "Все данные хранятся на серверах, расположенных на территории РФ"
        },
        {
            icon: GiAchievement,
            title: "Соответствие стандартам",
            description: "Полное соответствие требованиям законодательства РФ"
        },
        {
            icon: HiOutlineLightBulb,
            title: "Инновационные технологии",
            description: "Передовые технологии с учетом потребностей российского рынка"
        }
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 200)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!autoPlay) return

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % features.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [autoPlay, features.length])

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % features.length)
    }

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + features.length) % features.length)
    }

    return (
        <div className={styles.aboutContainer}>
            {/* Декоративные элементы фона */}
            <div className={styles.backgroundElements}>
                <div className={styles.bgCircle1}></div>
                <div className={styles.bgCircle2}></div>
                <div className={styles.bgCircle3}></div>
                <div className={styles.bgGrid}></div>
            </div>

            <div className={`${styles.aboutContent} ${isVisible ? styles.visible : ''}`}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        Преобразите ваш рабочий процесс
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        TASKFLOW объединяет мощь современных технологий с простотой использования,
                        чтобы вы могли сосредоточиться на самом важном.
                    </p>
                </div>

                <div className={styles.carouselSection}>
                    <div className={styles.carouselContainer}>
                        <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {features.map((feature, index) => (
                                <div key={index} className={styles.carouselSlide}>
                                    <div className={styles.slideContent}>
                                        <div
                                            className={styles.slideIcon}
                                            style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                                        >
                                            <feature.icon />
                                        </div>
                                        <h3 className={styles.slideTitle}>{feature.title}</h3>
                                        <p className={styles.slideDescription}>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.carouselControls}>
                            <button className={styles.carouselButton} onClick={prevSlide}>
                                <FaChevronLeft />
                            </button>
                            <button className={styles.carouselButton} onClick={nextSlide}>
                                <FaChevronRight />
                            </button>
                        </div>

                        <div className={styles.carouselIndicators}>
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>

                        <button
                            className={styles.autoplayButton}
                            onClick={() => setAutoPlay(!autoPlay)}
                        >
                            {autoPlay ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>99.9%</div>
                        <div className={styles.statLabel}>Время работы</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>10K+</div>
                        <div className={styles.statLabel}>Активных пользователей</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>50+</div>
                        <div className={styles.statLabel}>Интеграций</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>24/7</div>
                        <div className={styles.statLabel}>Поддержка</div>
                    </div>
                </div>

                <div className={styles.gallerySection}>
                    <h3 className={styles.galleryTitle}>Возможности платформы</h3>
                    <p className={styles.gallerySubtitle}>
                        Откройте для себя все инструменты, которые помогут вашей команде достигать большего
                    </p>

                    <div className={styles.galleryGrid}>
                        {galleryItems.map((item, index) => (
                            <div
                                key={index}
                                className={styles.galleryItem}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className={styles.galleryImage} style={{ background: item.gradient }}>
                                    <div className={styles.imagePlaceholder}>
                                        <div className={styles.imageIcon}>
                                            <item.icon />
                                        </div>
                                    </div>
                                    <div className={styles.galleryOverlay}>
                                        <div className={styles.overlayContent}>
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.galleryContent}>
                                    <h4 className={styles.galleryItemTitle}>{item.title}</h4>
                                    <p className={styles.galleryItemDescription}>{item.description}</p>

                                    <div className={styles.featureList}>
                                        {item.features.map((feature, idx) => (
                                            <div key={idx} className={styles.featureItem}>
                                                <FaCheck className={styles.featureIcon} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className={styles.galleryButton}>
                                        Подробнее
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.domesticSection}>
                    <div className={styles.domesticHeader}>
                        <h3 className={styles.domesticTitle}>Отечественная разработка</h3>
                        <p className={styles.domesticSubtitle}>
                            TASKFLOW — продукт, созданный в России для российских компаний
                        </p>
                    </div>

                    <div className={styles.domesticGrid}>
                        {advantages.map((advantage, index) => (
                            <div key={index} className={styles.domesticCard}>
                                <div className={styles.domesticIcon}>
                                    <advantage.icon />
                                </div>
                                <h4 className={styles.domesticCardTitle}>{advantage.title}</h4>
                                <p className={styles.domesticCardDescription}>{advantage.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.domesticBadge}>
                        <div className={styles.badgeContent}>
                            <div className={styles.certificateContainer}>
                                <div className={styles.certificateBorder}>
                                    <div className={styles.certificateInner}>
                                        <FaStar className={styles.certificateIcon} />
                                        <div className={styles.certificateSeal}></div>
                                        <div className={styles.certificateStamp}>Одобрено</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className={styles.badgeTitle}>Сертификат Антона Владимировича</h4>
                                <p className={styles.badgeText}>Одобрено Милешко Антоном Владимировичем! :)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.ctaSection}>
                    <h3 className={styles.ctaTitle}>Готовы начать?</h3>
                    <p className={styles.ctaDescription}>
                        Присоединяйтесь к тысячам команд, которые уже используют TASKFLOW для организации своей работы
                    </p>
                    <button className={styles.ctaButton}>
                        Начать бесплатно
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AboutSection