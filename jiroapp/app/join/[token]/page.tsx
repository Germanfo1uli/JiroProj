'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaProjectDiagram, FaUserPlus, FaExclamationTriangle, FaArrowRight, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { useAuth } from '@/app/auth/hooks/useAuth'
import { useNotification } from '@/app/auth/hooks/useNotification'
import { api } from '@/app/auth/hooks/useTokenRefresh'
import styles from './JoinPage.module.css'

interface ProjectInfo {
    id: number
    name: string
    description: string
    creatorName: string
    creatorId: number
    memberCount: number
    createdAt?: string
    avatar?: string
}

const JoinPageContent = () => {
    const params = useParams()
    const token = params.token as string
    const router = useRouter()
    const { isAuthenticated, getCurrentUser, manualRefreshToken } = useAuth()
    const { showSuccess, showError, showLoading, dismissToast } = useNotification()
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string>('')
    const [isMember, setIsMember] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) {
            fetchProjectInfo()
        } else {
            const checkTimer = setTimeout(() => {
                if (!isAuthenticated()) {
                    router.push(`/auth?redirect=/join/${token}`)
                }
            }, 1000)
            return () => clearTimeout(checkTimer)
        }
    }, [token, isAuthenticated])

    const fetchProjectInfo = async () => {
        setIsLoading(true)
        setError('')

        try {
            await manualRefreshToken()

            const currentUser = getCurrentUser()
            if (!currentUser) {
                throw new Error('Пользователь не найден')
            }

            const joinResponse = await api.post(`/projects/join/${token}`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            if (joinResponse.status === 200 || joinResponse.status === 201) {
                const projectId = joinResponse.data.projectId || joinResponse.data.id

                if (!projectId) {
                    throw new Error('Не удалось получить ID проекта')
                }

                const projectResponse = await api.get(`/projects/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })

                const projectData = projectResponse.data

                setProjectInfo({
                    id: projectData.id,
                    name: projectData.name,
                    description: projectData.description || 'Без описания',
                    creatorName: projectData.creatorName || 'Неизвестно',
                    creatorId: projectData.creatorId || 0,
                    memberCount: projectData.memberCount || 1,
                    createdAt: projectData.createdAt,
                    avatar: projectData.avatar
                })

                if (projectData.creatorId === currentUser.userId) {
                    setIsCreator(true)
                }
            }
        } catch (error: any) {
            console.error('Error in join process:', error)

            if (error.response?.status === 400) {
                const errorData = error.response.data
                const errorMsg = errorData?.message || 'Невозможно присоединиться к проекту'

                if (errorMsg.includes('уже участник') || errorMsg.includes('already a member')) {
                    setIsMember(true)

                    try {
                        const projectId = errorData.projectId
                        if (projectId) {
                            const projectResponse = await api.get(`/projects/${projectId}`, {
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                            })

                            const projectData = projectResponse.data
                            setProjectInfo({
                                id: projectData.id,
                                name: projectData.name,
                                description: projectData.description || 'Без описания',
                                creatorName: projectData.creatorName || 'Неизвестно',
                                creatorId: projectData.creatorId || 0,
                                memberCount: projectData.memberCount || 1,
                                createdAt: projectData.createdAt,
                                avatar: projectData.avatar
                            })
                        }
                    } catch (fetchError) {
                        console.error('Failed to fetch project info:', fetchError)
                    }
                } else if (errorMsg.includes('создателем') || errorMsg.includes('creator')) {
                    setIsCreator(true)
                }
            } else if (error.response?.status === 404) {
                setError('Проект не найден или ссылка недействительна')
            } else if (error.response?.status === 401) {
                setError('Требуется авторизация')
                router.push(`/auth?redirect=/join/${token}`)
            } else if (error.code === 'ERR_NETWORK') {
                setError('Ошибка сети. Проверьте подключение к серверу.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleJoinProject = async () => {
        if (isMember || isCreator || !projectInfo) return

        setIsProcessing(true)

        try {
            await manualRefreshToken()

            const response = await api.post(`/projects/join/${token}`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            if (response.status === 200 || response.status === 201) {
                showSuccess('Вы успешно присоединились к проекту!')
                setHasJoined(true)

                setTimeout(() => {
                    router.push('/main')
                }, 1500)
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Ошибка при присоединении к проекту'
            showError(errorMsg)

            if (error.response?.status === 400) {
                const data = error.response.data
                if (data.message?.includes('создателем') || data.message?.includes('участником')) {
                    setIsMember(data.message.includes('участником'))
                    setIsCreator(data.message.includes('создателем'))
                }
            }

            setIsProcessing(false)
        }
    }

    const handleContinue = () => {
        router.push('/main')
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Обработка приглашения...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <AnimatePresence mode="wait">
                {hasJoined ? (
                    <motion.div
                        key="success"
                        className={styles.successCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <motion.div
                            className={styles.successIconWrapper}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <FaCheck className={styles.successIcon} />
                        </motion.div>

                        <motion.h1
                            className={styles.successTitle}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, ease: "easeOut" }}
                        >
                            Добро пожаловать в команду!
                        </motion.h1>

                        <motion.p
                            className={styles.successSubtitle}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, ease: "easeOut" }}
                        >
                            Вы успешно присоединились к проекту
                        </motion.p>

                        {projectInfo && (
                            <motion.div
                                className={styles.successProjectInfo}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, ease: "easeOut" }}
                            >
                                <div className={styles.successProjectCard}>
                                    <FaProjectDiagram className={styles.successProjectIcon} />
                                    <div className={styles.successProjectDetails}>
                                        <h3 className={styles.successProjectName}>{projectInfo.name}</h3>
                                        <p className={styles.successProjectCreator}>от {projectInfo.creatorName}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            className={styles.continueButton}
                            onClick={handleContinue}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, ease: "easeOut" }}
                        >
                            <span>Продолжить</span>
                            <FaArrowRight className={styles.continueIcon} />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="invite"
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {(isCreator || isMember) && (
                            <div className={styles.statusBadge}>
                                {isCreator ? (
                                    <>
                                        <FaExclamationTriangle className={styles.statusIcon} />
                                        <span>Вы создатель</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className={styles.statusIcon} />
                                        <span>Уже участник</span>
                                    </>
                                )}
                            </div>
                        )}

                        <motion.div
                            className={styles.header}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, ease: "easeOut" }}
                        >
                            <motion.div
                                className={styles.iconWrapper}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5, ease: "linear" }}
                            >
                                <FaProjectDiagram className={styles.projectIcon} />
                            </motion.div>
                            <h1 className={styles.title}>
                                {isCreator ? 'Вы создатель' : isMember ? 'Вы уже участник' : 'Приглашение в проект'}
                            </h1>
                            <p className={styles.subtitle}>
                                {isCreator
                                    ? 'Вы создали этот проект'
                                    : isMember
                                        ? 'Вы уже являетесь участником этого проекта'
                                        : 'Вас пригласили присоединиться к проекту'}
                            </p>
                        </motion.div>

                        {projectInfo && (
                            <motion.div
                                className={styles.projectInfo}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, ease: "easeOut" }}
                            >
                                <div className={styles.projectCard}>
                                    <div className={styles.projectHeader}>
                                        <div className={styles.projectAvatar}>
                                            {projectInfo.avatar ? (
                                                <img src={projectInfo.avatar} alt={projectInfo.name} />
                                            ) : (
                                                <FaProjectDiagram />
                                            )}
                                        </div>
                                        <div className={styles.projectTitle}>
                                            <h2 className={styles.projectName}>{projectInfo.name}</h2>
                                            <p className={styles.projectCreator}>от {projectInfo.creatorName}</p>
                                        </div>
                                    </div>

                                    <p className={styles.projectDescription}>{projectInfo.description}</p>

                                    <div className={styles.projectStats}>
                                        <div className={styles.stat}>
                                            <FaUsers className={styles.statIcon} />
                                            <span className={styles.statValue}>{projectInfo.memberCount}</span>
                                            <span className={styles.statLabel}>участников</span>
                                        </div>
                                        {projectInfo.createdAt && (
                                            <div className={styles.stat}>
                                                <FaCalendarAlt className={styles.statIcon} />
                                                <span className={styles.statValue}>
                                                    {new Date(projectInfo.createdAt).toLocaleDateString('ru-RU')}
                                                </span>
                                                <span className={styles.statLabel}>создан</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            className={styles.actions}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, ease: "easeOut" }}
                        >
                            {!isCreator && !isMember && projectInfo && (
                                <motion.button
                                    className={styles.joinButton}
                                    onClick={handleJoinProject}
                                    disabled={isProcessing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    layout
                                >
                                    {isProcessing ? (
                                        <div className={styles.buttonSpinner}></div>
                                    ) : (
                                        <>
                                            <FaUserPlus className={styles.buttonIcon} />
                                            Присоединиться к проекту
                                        </>
                                    )}
                                </motion.button>
                            )}

                            {(isCreator || isMember) && (
                                <motion.button
                                    className={styles.primaryButton}
                                    onClick={handleContinue}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    layout
                                >
                                    Продолжить
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const JoinPage = () => {
    return (
        <Suspense fallback={
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
            </div>
        }>
            <JoinPageContent />
        </Suspense>
    )
}

export default JoinPage