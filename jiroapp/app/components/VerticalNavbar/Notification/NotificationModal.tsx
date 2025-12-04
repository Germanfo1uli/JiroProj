'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRegSadTear, FaTimes } from 'react-icons/fa'
import styles from './NotificationModal.module.css'

interface NotificationModalProps {
    onClose: () => void
}

export default function NotificationModal({ onClose }: NotificationModalProps) {
    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])


    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [handleClose])

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    className={styles.modalContent}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.div
                        className={styles.modalHeader}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.h3
                            id="modal-title"
                            className={styles.modalTitle}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Уведомления
                        </motion.h3>
                        <motion.button
                            className={styles.closeButton}
                            onClick={handleClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Закрыть"
                        >
                            <FaTimes />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        className={styles.modalBody}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className={styles.emptyState}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.3 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <FaRegSadTear className={styles.sadIcon} />
                            </motion.div>
                            <motion.p
                                className={styles.emptyText}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Нет уведомлений
                            </motion.p>
                            <motion.p
                                className={styles.emptySubtext}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Здесь пока пусто... Вы никому не нужны :(
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}