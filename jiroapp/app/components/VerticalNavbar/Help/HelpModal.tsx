'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import Image from 'next/image'
import styles from './HelpModal.module.css'
import helpCat from './helpCat.jpg'

interface HelpModalProps {
    onClose: () => void
}

export default function HelpModal({ onClose }: HelpModalProps) {
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
                    className={styles.helpModal}
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.button
                        className={styles.closeButton}
                        onClick={handleClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Закрыть"
                    >
                        <FaTimes />
                    </motion.button>

                    <motion.div
                        className={styles.modalContent}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.div
                            className={styles.catContainer}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
                        >
                            <motion.div
                                className={styles.catImageWrapper}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            >
                                <Image
                                    src={helpCat}
                                    alt="Грустный кот в кружке"
                                    width={200}
                                    height={200}
                                    className={styles.catImage}
                                    priority
                                    quality={90}
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className={styles.helpContent}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.h2
                                id="modal-title"
                                className={styles.helpTitle}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Помогите мне
                            </motion.h2>
                            <motion.p
                                className={styles.helpText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Я очень устал, босс.<br />
                                Я один, я хочу кушать, вкусно кушать.
                                Мне хочется джина... Лампу джина с желаниями...
                                Я хочу всё... Уничтожить мир...
                            </motion.p>
                            <motion.div
                                className={styles.helpActions}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.button
                                    className={styles.helpButton}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClose}
                                >
                                    Это жизнь, котик, что поделать...
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}