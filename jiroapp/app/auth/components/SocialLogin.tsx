'use client'

import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import toast from 'react-hot-toast'
import styles from './SocialLogin.module.css'

const SocialLogin = memo(() => {
    const [loading, setLoading] = useState<'google' | 'github' | null>(null)

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        setLoading(provider)
        try {
            const authUrl = provider === 'google'
                ? '/api/auth/google'
                : '/api/auth/github'

            window.location.href = authUrl

            toast.loading(`Подключение к ${provider}...`, { id: provider })

        } catch (error) {
            toast.error(`Ошибка при подключении к ${provider}`)
        } finally {
            setTimeout(() => setLoading(null), 1000)
        }
    }

    const buttonVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        hover: { y: -2 },
        tap: { scale: 0.98 }
    }

    return (
        <motion.div
            className={styles.socialLogin}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.7 }}
        >
            <motion.div
                className={styles.divider}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span>или войдите с помощью</span>
            </motion.div>

            <motion.div
                className={styles.socialButtons}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, staggerChildren: 0.1 }}
            >
                <motion.button
                    type="button"
                    className={`${styles.socialButton} ${styles.google}`}
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading === 'google'}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Войти через Google"
                >
                    <AnimatePresence mode="wait">
                        {loading === 'google' ? (
                            <motion.div
                                key="google-loading"
                                className={styles.loadingSpinner}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        ) : (
                            <motion.div
                                key="google-icon"
                                className={styles.socialIcon}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <FaGoogle />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className={styles.buttonText}>
            {loading === 'google' ? 'Подключение...' : 'Google'}
          </span>
                </motion.button>

                <motion.button
                    type="button"
                    className={`${styles.socialButton} ${styles.github}`}
                    onClick={() => handleSocialAuth('github')}
                    disabled={loading === 'github'}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Войти через GitHub"
                >
                    <AnimatePresence mode="wait">
                        {loading === 'github' ? (
                            <motion.div
                                key="github-loading"
                                className={styles.loadingSpinner}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        ) : (
                            <motion.div
                                key="github-icon"
                                className={styles.socialIcon}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <FaGithub />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className={styles.buttonText}>
            {loading === 'github' ? 'Подключение...' : 'GitHub'}
          </span>
                </motion.button>
            </motion.div>
        </motion.div>
    )
})

SocialLogin.displayName = 'SocialLogin'

export default SocialLogin