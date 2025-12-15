'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle, FaTimes, FaTrash, FaCommentSlash } from 'react-icons/fa'
import styles from '../ConfirmationModal.module.css'

interface CommentDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    commentAuthor?: string
}

export default function CommentDeleteModal({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               commentAuthor
                                           }: CommentDeleteModalProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                confirmButtonRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    if (!isOpen) return null

    const title = "Удаление комментария"
    const message = commentAuthor
        ? `Вы уверены, что хотите удалить комментарий пользователя "${commentAuthor}"? Это действие нельзя отменить.`
        : "Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить."

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.modalContent}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <motion.div
                            className={styles.modalHeader}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className={styles.titleSection}>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
                                >
                                    <FaCommentSlash className={styles.warningIcon} />
                                </motion.div>
                                <motion.h3
                                    id="modal-title"
                                    className={styles.modalTitle}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {title}
                                </motion.h3>
                            </div>
                            <motion.button
                                className={styles.closeButton}
                                onClick={onClose}
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
                            <motion.p
                                id="modal-description"
                                className={styles.message}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                            >
                                {message}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className={styles.modalActions}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                className={styles.cancelButton}
                                onClick={onClose}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Отмена
                            </motion.button>
                            <motion.button
                                ref={confirmButtonRef}
                                className={`${styles.confirmButton} ${styles.destructive}`}
                                onClick={handleConfirm}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                autoFocus
                            >
                                <motion.span
                                    className={styles.confirmIconWrapper}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <FaTrash className={styles.confirmIcon} />
                                </motion.span>
                                Удалить комментарий
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}