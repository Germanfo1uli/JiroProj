'use client'

import { FaSmile, FaPlus, FaTrello, FaLightbulb, FaUsers, FaStar } from 'react-icons/fa'
import styles from './BoardsContent.module.css'

const BoardsContent = () => {
    return (
        <div className={styles.boardsContent}>
            <div className={styles.backgroundElements}>
                <div className={`${styles.glowSpot} ${styles.spot1}`}></div>
                <div className={`${styles.glowSpot} ${styles.spot2}`}></div>
            </div>

            <div className={styles.boardsHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleSection}>
                        <h1 className={styles.pageTitle}>Добро пожаловать в TaskFlow</h1>
                        <p className={styles.pageSubtitle}>
                            Начните свое путешествие в эффективном управлении задачами
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.boardsMainContent}>
                <div className={styles.contentGrid}>
                    <div className={styles.welcomeCard}>
                        <div className={styles.welcomeContent}>
                            <div className={styles.welcomeIconContainer}>
                                <div className={styles.welcomeIconGlow}></div>
                                <div className={styles.welcomeIcon}>
                                    <FaSmile className={styles.smileIcon} />
                                </div>
                            </div>

                            <div className={styles.welcomeTextContent}>
                                <h2 className={styles.welcomeTitle}>
                                    Начните работать с
                                    <span className={styles.titleAccent}> TaskFlow</span>
                                </h2>
                                <p className={styles.welcomeDescription}>
                                    TaskFlow — это интуитивно понятный инструмент для управления задачами и проектами.
                                    Создавайте доски, добавляйте задачи и сотрудничайте с командой в одном месте.
                                </p>
                            </div>

                            <div className={styles.featureHighlights}>
                                <div className={styles.featureItem}>
                                    <FaLightbulb className={styles.featureIcon} />
                                    <span>Простое управление задачами</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <FaUsers className={styles.featureIcon} />
                                    <span>Командное взаимодействие</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <FaStar className={styles.featureIcon} />
                                    <span>Интуитивный интерфейс</span>
                                </div>
                            </div>

                            <div className={styles.welcomeActions}>
                                <button className={styles.primaryActionBtn}>
                                    <FaPlus className={styles.actionBtnIcon} />
                                    Создать первую доску
                                </button>
                                <button className={styles.secondaryActionBtn}>
                                    Изучить возможности
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickActionsPanel}>
                        <div className={styles.panelHeader}>
                            <h3>Быстрый старт</h3>
                        </div>

                        <div className={styles.actionCards}>
                            <div className={styles.actionCard}>
                                <div className={styles.actionIconWrapper}>
                                    <FaPlus />
                                </div>
                                <div className={styles.actionContent}>
                                    <h4>Создать доску</h4>
                                    <p>Начните с создания вашей первой доски</p>
                                </div>
                            </div>

                            <div className={styles.actionCard}>
                                <div className={styles.actionIconWrapper}>
                                    <FaUsers />
                                </div>
                                <div className={styles.actionContent}>
                                    <h4>Пригласить команду</h4>
                                    <p>Добавьте коллег для совместной работы</p>
                                </div>
                            </div>

                            <div className={styles.actionCard}>
                                <div className={styles.actionIconWrapper}>
                                    <FaTrello />
                                </div>
                                <div className={styles.actionContent}>
                                    <h4>Добавить задачу</h4>
                                    <p>Создайте вашу первую задачу</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.tipsSection}>
                    <h3 className={styles.tipsTitle}>Советы для начинающих</h3>
                    <div className={styles.tipsGrid}>
                        <div className={styles.tipCard}>
                            <div className={styles.tipIconWrapper}>
                                <FaTrello />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Организуйте доски</h4>
                                <p>Создавайте отдельные доски для разных проектов</p>
                            </div>
                        </div>
                        <div className={styles.tipCard}>
                            <div className={styles.tipIconWrapper}>
                                <FaPlus />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Добавляйте детали</h4>
                                <p>Указывайте сроки и приоритеты для задач</p>
                            </div>
                        </div>
                        <div className={styles.tipCard}>
                            <div className={styles.tipIconWrapper}>
                                <FaUsers />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Работайте в команде</h4>
                                <p>Приглашайте коллег и отслеживайте прогресс</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardsContent