'use client'

import { useState, useEffect } from 'react'
import {
    FaSmile,
    FaPlus,
    FaTrello,
    FaLightbulb,
    FaUsers,
    FaStar,
    FaRocket,
    FaChartLine,
    FaMagic,
    FaHandshake,
    FaBullseye,
    FaBell,
    FaQuestionCircle
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import CreateProjectModal from '../VerticalNavbar/CreateProject/CreateProjectModal'
import { Project } from '../VerticalNavbar/CreateProject/types/types'
import styles from './BoardsContent.module.css'

const BoardsContent = () => {
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [isFirstVisit, setIsFirstVisit] = useState(true)
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    useEffect(() => {
        const visited = localStorage.getItem('taskflow_visited')
        if (visited) {
            setIsFirstVisit(false)
        } else {
            localStorage.setItem('taskflow_visited', 'true')
        }
    }, [])

    const handleCreateProjectClick = () => {
        setIsCreateProjectOpen(true)
    }

    const handleProjectCreated = (project: Project) => {
        setProjects(prev => [project, ...prev])
        setIsCreateProjectOpen(false)
    }

    const closeCreateProject = () => {
        setIsCreateProjectOpen(false)
    }

    const handleCardHover = (index: number) => {
        setHoveredCard(index)
    }

    const handleCardLeave = () => {
        setHoveredCard(null)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    const cardVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.03,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    }

    return (
        <>
            <motion.div
                className={styles.boardsContent}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className={styles.backgroundElements}>
                    <div className={`${styles.glowSpot} ${styles.spot1}`}></div>
                    <div className={`${styles.glowSpot} ${styles.spot2}`}></div>
                    <div className={`${styles.glowSpot} ${styles.spot3}`}></div>
                    <div className={`${styles.glowSpot} ${styles.spot4}`}></div>

                    <div className={styles.particles}>
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={styles.particle}
                                animate={{
                                    y: [0, -20, 0],
                                    x: [0, Math.random() * 20 - 10, 0],
                                    opacity: [0.3, 0.7, 0.3]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    className={styles.boardsHeader}
                    variants={itemVariants}
                >
                    <div className={styles.headerContent}>
                        <div className={styles.pageTitleSection}>
                            <motion.div
                                className={styles.titleBadge}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    delay: 0.5
                                }}
                            >
                                <FaRocket className={styles.badgeIcon} />
                                <span>Новая платформа</span>
                            </motion.div>

                            <motion.h1
                                className={styles.pageTitle}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {isFirstVisit ? (
                                    <>
                                        Добро пожаловать в <span className={styles.titleGradient}>TaskFlow</span>
                                    </>
                                ) : (
                                    <>
                                        С возвращением в <span className={styles.titleGradient}>TaskFlow</span>
                                    </>
                                )}
                            </motion.h1>

                            <motion.p
                                className={styles.pageSubtitle}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {isFirstVisit
                                    ? "Начните свое путешествие в эффективном управлении задачами"
                                    : "Продолжайте работу над вашими проектами эффективно"
                                }
                            </motion.p>

                            {isFirstVisit && (
                                <motion.div
                                    className={styles.welcomeBadge}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                >
                                    <FaStar className={styles.badgeStar} />
                                    <span>Первое посещение</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className={styles.boardsMainContent}>
                    <motion.div
                        className={styles.contentGrid}
                        variants={containerVariants}
                    >
                        <motion.div
                            className={styles.welcomeCard}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.01,
                                boxShadow: "0 20px 40px rgba(61, 107, 179, 0.15)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className={styles.cardGlow}></div>

                            <div className={styles.welcomeContent}>
                                <motion.div
                                    className={styles.welcomeIconContainer}
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                    }}
                                >
                                    <div className={styles.welcomeIconGlow}></div>
                                    <motion.div
                                        className={styles.welcomeIcon}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <FaSmile className={styles.smileIcon} />
                                    </motion.div>
                                </motion.div>

                                <div className={styles.welcomeTextContent}>
                                    <motion.h2
                                        className={styles.welcomeTitle}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {isFirstVisit ? (
                                            <>
                                                Начните работать с{' '}
                                                <span className={styles.titleAccent}>TaskFlow</span>
                                            </>
                                        ) : (
                                            <>
                                                Продолжайте работу с{' '}
                                                <span className={styles.titleAccent}>TaskFlow</span>
                                            </>
                                        )}
                                    </motion.h2>

                                    <motion.p
                                        className={styles.welcomeDescription}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        TaskFlow — это современная платформа для управления задачами и проектами.
                                        Создавайте проекты, отслеживайте прогресс и сотрудничайте с командой в реальном времени.
                                    </motion.p>
                                </div>

                                <motion.div
                                    className={styles.quickMetrics}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className={styles.metric}>
                                        <FaChartLine className={styles.metricIcon} />
                                        <div>
                                            <span className={styles.metricValue}>0</span>
                                            <span className={styles.metricLabel}>Проектов</span>
                                        </div>
                                    </div>
                                    <div className={styles.metric}>
                                        <FaTrello className={styles.metricIcon} />
                                        <div>
                                            <span className={styles.metricValue}>0</span>
                                            <span className={styles.metricLabel}>Задач</span>
                                        </div>
                                    </div>
                                    <div className={styles.metric}>
                                        <FaUsers className={styles.metricIcon} />
                                        <div>
                                            <span className={styles.metricValue}>1</span>
                                            <span className={styles.metricLabel}>Участник</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className={styles.featureHighlights}
                                    variants={containerVariants}
                                >
                                    <motion.div
                                        className={styles.featureItem}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <FaLightbulb className={styles.featureIcon} />
                                        <span>Интеллектуальное управление</span>
                                    </motion.div>
                                    <motion.div
                                        className={styles.featureItem}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <FaMagic className={styles.featureIcon} />
                                        <span>Автоматизация процессов</span>
                                    </motion.div>
                                    <motion.div
                                        className={styles.featureItem}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <FaHandshake className={styles.featureIcon} />
                                        <span>Командная работа</span>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    className={styles.welcomeActions}
                                    variants={containerVariants}
                                >
                                    <motion.button
                                        className={`${styles.primaryActionBtn} ${styles.glowButton}`}
                                        onClick={handleCreateProjectClick}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={itemVariants}
                                    >
                                        <FaPlus className={styles.actionBtnIcon} />
                                        Создать первый проект
                                        <div className={styles.buttonGlow}></div>
                                    </motion.button>

                                    <motion.button
                                        className={styles.secondaryActionBtn}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={itemVariants}
                                    >
                                        <FaRocket className={styles.actionBtnIcon} />
                                        Изучить возможности
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.quickActionsPanel}
                            variants={itemVariants}
                        >
                            <div className={styles.panelHeader}>
                                <h3>Быстрый старт</h3>
                                <span className={styles.panelSubtitle}>Начните за минуту</span>
                            </div>

                            <div className={styles.actionCards}>
                                <motion.div
                                    className={`${styles.actionCard} ${hoveredCard === 0 ? styles.hovered : ''}`}
                                    onClick={handleCreateProjectClick}
                                    onMouseEnter={() => handleCardHover(0)}
                                    onMouseLeave={handleCardLeave}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    initial="initial"
                                >
                                    <div className={styles.actionIconWrapper}>
                                        <FaPlus />
                                        <div className={styles.iconGlow}></div>
                                    </div>
                                    <div className={styles.actionContent}>
                                        <h4>Создать проект</h4>
                                        <p>Начните с создания вашего первого проекта</p>
                                        <span className={styles.actionHint}>Нажмите чтобы начать</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className={`${styles.actionCard} ${hoveredCard === 1 ? styles.hovered : ''}`}
                                    onMouseEnter={() => handleCardHover(1)}
                                    onMouseLeave={handleCardLeave}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    initial="initial"
                                >
                                    <div className={styles.actionIconWrapper}>
                                        <FaUsers />
                                        <div className={styles.iconGlow}></div>
                                    </div>
                                    <div className={styles.actionContent}>
                                        <h4>Пригласить команду</h4>
                                        <p>Добавьте коллег для совместной работы</p>
                                        <span className={styles.actionHint}>Скоро доступно</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className={`${styles.actionCard} ${hoveredCard === 2 ? styles.hovered : ''}`}
                                    onMouseEnter={() => handleCardHover(2)}
                                    onMouseLeave={handleCardLeave}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    initial="initial"
                                >
                                    <div className={styles.actionIconWrapper}>
                                        <FaTrello />
                                        <div className={styles.iconGlow}></div>
                                    </div>
                                    <div className={styles.actionContent}>
                                        <h4>Добавить задачу</h4>
                                        <p>Создайте вашу первую задачу</p>
                                        <span className={styles.actionHint}>Создайте проект</span>
                                    </div>
                                </motion.div>
                            </div>

                            <div className={styles.quickTips}>
                                <div className={styles.tipHeader}>
                                    <FaBell className={styles.tipIcon} />
                                    <span>Совет дня</span>
                                </div>
                                <p className={styles.tipText}>
                                    Начните с небольшого проекта, чтобы освоить все возможности TaskFlow
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={styles.tipsSection}
                        variants={itemVariants}
                    >
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.tipsTitle}>
                                <FaBullseye className={styles.titleIcon} />
                                Советы для эффективной работы
                            </h3>
                            <button className={styles.helpButton}>
                                <FaQuestionCircle />
                                <span>Помощь</span>
                            </button>
                        </div>

                        <motion.div
                            className={styles.tipsGrid}
                            variants={containerVariants}
                        >
                            <motion.div
                                className={styles.tipCard}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 15px 30px rgba(61, 107, 179, 0.12)"
                                }}
                            >
                                <div className={styles.tipIconWrapper}>
                                    <FaTrello />
                                    <div className={styles.tipIconGlow}></div>
                                </div>
                                <div className={styles.tipContent}>
                                    <h4>Организуйте проекты</h4>
                                    <p>Создавайте отдельные проекты для разных направлений работы и отслеживайте прогресс</p>
                                    <div className={styles.tipBadge}>Рекомендация</div>
                                </div>
                            </motion.div>

                            <motion.div
                                className={styles.tipCard}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 15px 30px rgba(61, 107, 179, 0.12)"
                                }}
                            >
                                <div className={styles.tipIconWrapper}>
                                    <FaUsers />
                                    <div className={styles.tipIconGlow}></div>
                                </div>
                                <div className={styles.tipContent}>
                                    <h4>Работайте в команде</h4>
                                    <p>Приглашайте коллег и отслеживайте прогресс всей команды в реальном времени</p>
                                    <div className={styles.tipBadge}>Коллаборация</div>
                                </div>
                            </motion.div>

                            <motion.div
                                className={styles.tipCard}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 15px 30px rgba(61, 107, 179, 0.12)"
                                }}
                            >
                                <div className={styles.tipIconWrapper}>
                                    <FaLightbulb />
                                    <div className={styles.tipIconGlow}></div>
                                </div>
                                <div className={styles.tipContent}>
                                    <h4>Используйте метки</h4>
                                    <p>Добавляйте метки для удобной сортировки задач и быстрого поиска</p>
                                    <div className={styles.tipBadge}>Продуктивность</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {isFirstVisit && (
                        <motion.div
                            className={styles.achievementsSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h3 className={styles.achievementsTitle}>
                                <FaStar className={styles.achievementsIcon} />
                                Ваш прогресс
                            </h3>
                            <div className={styles.achievementsGrid}>
                                <div className={styles.achievement}>
                                    <div className={styles.achievementIcon}>
                                        <FaRocket />
                                    </div>
                                    <div className={styles.achievementContent}>
                                        <h4>Добро пожаловать!</h4>
                                        <p>Вы успешно начали работу с TaskFlow</p>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.achievement}>
                                    <div className={styles.achievementIcon}>
                                        <FaPlus />
                                    </div>
                                    <div className={styles.achievementContent}>
                                        <h4>Первый проект</h4>
                                        <p>Создайте свой первый проект</p>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isCreateProjectOpen && (
                    <CreateProjectModal
                        isOpen={isCreateProjectOpen}
                        onClose={closeCreateProject}
                        onProjectCreated={handleProjectCreated}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default BoardsContent