'use client'

import React, { useState, useEffect, Suspense, memo } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight, FaTasks } from 'react-icons/fa'
import { Formik, FormikHelpers } from 'formik'
import { FormValues } from './types/auth'
import { useAuth } from './hooks/useAuth'
import { LoginSchema, RegisterSchema } from './validations/validationSchemas'
import AuthForm from './components/AuthForm'
import SocialLogin from './components/SocialLogin'
import { NotificationProvider } from './components/Notification'
import styles from './AuthPage.module.css'

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('AuthPage error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorContainer}>
                    <h2>Что-то пошло не так</h2>
                    <button onClick={() => window.location.reload()}>Перезагрузить</button>
                </div>
            )
        }
        return this.props.children
    }
}

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()
    const { loginUser, registerUser } = useAuth()

    useEffect(() => {
        const controller = new AbortController()

        try {
            const token = localStorage.getItem('token')
            if (token && !controller.signal.aborted) {
                router.push('/main')
            }
        } catch (error) {
            console.error('Token check failed:', error)
        }

        const timer = setTimeout(() => setIsVisible(true), 100)

        return () => {
            controller.abort()
            clearTimeout(timer)
        }
    }, [router])

    const handleBack = () => {
        setIsVisible(false)
        setTimeout(() => router.push('/welcome'), 600)
    }

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, setErrors }: FormikHelpers<FormValues>
    ) => {
        try {
            if (isLogin) {
                const result = await loginUser(values.email, values.password, router.push)
                if (!result.success) {
                    setErrors({ email: result.message })
                }
            } else {
                const result = await registerUser(values.name, values.email, values.password, router.push)
                if (!result.success) {
                    setErrors({ email: result.message })
                }
            }
        } catch (error) {
            setErrors({ email: 'Произошла ошибка. Попробуйте снова.' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Head>
                <title>{isLogin ? 'Вход - TaskFlow' : 'Регистрация - TaskFlow'}</title>
                <meta name="description" content="Аутентификация в TaskFlow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <NotificationProvider />

            <main className={styles.authContainer} data-testid="auth-page">
                <motion.div
                    className={styles.logoWrapper}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                    <div className={styles.logo}>
                        <FaTasks className={styles.logoIcon} aria-label="TaskFlow Logo" />
                        <span>TASKFLOW</span>
                    </div>
                </motion.div>

                <motion.div
                    className={`${styles.authContent} ${isVisible ? styles.visible : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <motion.button
                        className={styles.backButton}
                        onClick={handleBack}
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <FaArrowRight className={styles.backIcon} aria-hidden="true" />
                        Назад
                    </motion.button>

                    <motion.div
                        className={styles.authCard}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <header className={styles.authHeader}>
                            <motion.h1
                                className={styles.authTitle}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {isLogin ? 'Вход в систему' : 'Регистрация'}
                            </motion.h1>
                            <motion.p
                                className={styles.authSubtitle}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {isLogin ? 'Войдите, чтобы продолжить работу' : 'Создайте аккаунт для начала работы'}
                            </motion.p>
                        </header>

                        <nav className={styles.authTabs} role="tablist">
                            <motion.button
                                role="tab"
                                aria-selected={isLogin}
                                aria-controls="login-panel"
                                className={`${styles.tabButton} ${isLogin ? styles.active : ''}`}
                                onClick={() => setIsLogin(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                Вход
                            </motion.button>
                            <motion.button
                                role="tab"
                                aria-selected={!isLogin}
                                aria-controls="register-panel"
                                className={`${styles.tabButton} ${!isLogin ? styles.active : ''}`}
                                onClick={() => setIsLogin(false)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                Регистрация
                            </motion.button>
                        </nav>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Formik
                                    initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                                    validationSchema={isLogin ? LoginSchema : RegisterSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <ErrorBoundary>
                                            <AuthForm
                                                isLogin={isLogin}
                                                errors={errors}
                                                touched={touched}
                                                isSubmitting={isSubmitting}
                                            />
                                        </ErrorBoundary>
                                    )}
                                </Formik>
                            </motion.div>
                        </AnimatePresence>

                        {isLogin && <SocialLogin />}
                    </motion.div>
                </motion.div>
            </main>
        </>
    )
})

AuthPage.displayName = 'AuthPage'

export default AuthPage
