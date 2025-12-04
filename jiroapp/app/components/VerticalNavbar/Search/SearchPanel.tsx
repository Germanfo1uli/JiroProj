'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { FaSearch, FaTimes, FaLink, FaCopy, FaCheck } from 'react-icons/fa'
import styles from './SearchPanel.module.css'

// Схема валидации
const schema = z.object({
    inviteLink: z.string().min(1, 'Вставьте ссылку').regex(
        /^https:\/\/taskflow\.ru\/invite\/[a-zA-Z0-9-]+$/,
        'Неверный формат ссылки. Пример: https://taskflow.ru/invite/abc123-def456'
    ),
})

type FormData = z.infer<typeof schema>

interface SearchPanelProps {
    onClose: () => void
    onJoinProject: (inviteCode: string) => Promise<void> | void
}

export default function SearchPanel({ onClose, onJoinProject }: SearchPanelProps) {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            inviteLink: '',
        },
    })

    const inviteLink = watch('inviteLink')

    // Обработка вставки из буфера
    const handlePasteFromClipboard = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText()
            setValue('inviteLink', text, { shouldValidate: true })

            if (schema.shape.inviteLink.safeParse(text).success) {
                toast.success('Ссылка вставлена из буфера')
            } else {
                toast.error('В буфере неверная ссылка', {
                    icon: '❌',
                })
            }
        } catch (error) {
            toast.error('Не удалось получить доступ к буферу', {
                icon: '📋',
            })
            console.error('Ошибка при чтении из буфера обмена:', error)
        }
    }, [setValue])

    // Обработка поиска
    const onSubmit = useCallback(async (data: FormData) => {
        const inviteCode = data.inviteLink.split('/').pop() || ''
        try {
            toast.loading('Присоединение к проекту...', { id: 'join-project' })
            await onJoinProject(inviteCode)
            toast.success('Успешно присоединено к проекту', {
                id: 'join-project',
                icon: '🎉',
            })
            onClose()
        } catch (error) {
            toast.error('Не удалось присоединиться к проекту', {
                id: 'join-project',
                icon: '🚫',
            })
            console.error('Ошибка присоединения:', error)
        }
    }, [onJoinProject, onClose])

    const quickExamples = useMemo(() => [
        'https://taskflow.ru/invite/abc123-def456-ghi789'
    ], [])

    const handleExampleClick = useCallback((example: string) => {
        setValue('inviteLink', example, { shouldValidate: true })
    }, [setValue])

    return (
        <AnimatePresence>
            <motion.div
                className={styles.panelOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.searchPanel}
                    initial={{ opacity: 0, x: -20, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: -10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="search-title"
                >
                    <motion.form onSubmit={handleSubmit(onSubmit)} className={styles.searchHeader}>
                        <motion.div
                            className={`${styles.searchInputWrapper} ${errors.inviteLink ? styles.invalid : inviteLink ? styles.valid : ''}`}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                            <motion.div
                                animate={{ rotate: inviteLink ? 360 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaLink className={styles.searchIcon} />
                            </motion.div>

                            <Controller
                                name="inviteLink"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Вставьте пригласительную ссылку..."
                                        className={styles.searchInput}
                                        autoFocus
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                )}
                            />

                            <AnimatePresence mode="wait">
                                {inviteLink && (
                                    <motion.button
                                        type="button"
                                        className={styles.clearButton}
                                        onClick={() => setValue('inviteLink', '', { shouldValidate: false })}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label="Очистить"
                                    >
                                        <FaTimes />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="button"
                                className={styles.pasteButton}
                                onClick={handlePasteFromClipboard}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Вставить из буфера обмена"
                                aria-label="Вставить из буфера"
                            >
                                <FaCopy className={styles.pasteIcon} />
                            </motion.button>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {errors.inviteLink && (
                                <motion.div
                                    className={styles.errorMessage}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {errors.inviteLink.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {inviteLink && !errors.inviteLink && (
                                <motion.div
                                    className={styles.successMessage}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <FaCheck className={styles.successIcon} />
                                    Ссылка валидна! Нажмите Enter для присоединения
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>

                    <AnimatePresence mode="wait">
                        {inviteLink === '' && (
                            <motion.div
                                className={styles.quickSearches}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className={styles.quickTitle}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Примеры ссылок
                                </motion.div>
                                <div className={styles.examplesList}>
                                    {quickExamples.map((example, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            className={styles.exampleLink}
                                            onClick={() => handleExampleClick(example)}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                            >
                                                <FaLink className={styles.linkIcon} />
                                            </motion.div>
                                            <span className={styles.linkText}>{example}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}