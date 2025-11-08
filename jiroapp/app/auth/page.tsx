'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight, FaTasks, FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import styles from './AuthPage.module.css'

interface FormValues {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const handleBack = () => {
        setIsVisible(false)
        setTimeout(() => {
            router.push('/welcome')
        }, 600)
    }

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Некорректный email')
            .required('Обязательное поле'),
        password: Yup.string()
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .required('Обязательное поле')
    })

    const RegisterSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Имя должно содержать минимум 2 символа')
            .required('Обязательное поле'),
        email: Yup.string()
            .email('Некорректный email')
            .required('Обязательное поле'),
        password: Yup.string()
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .required('Обязательное поле'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
            .required('Обязательное поле')
    })

    const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        console.log(values)
        setTimeout(() => {
            setSubmitting(false)
            router.push('/main')
        }, 2000)
    }

    const initialValues: FormValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authHeaderLogo}>
                <div className={styles.logo}>
                    <FaTasks className={styles.logoIcon} />
                    <span>TASKFLOW</span>
                </div>
            </div>

            <div className={`${styles.authContent} ${isVisible ? styles.visible : ''}`}>

                <button className={styles.backButton} onClick={handleBack}>
                    <FaArrowRight className={styles.backIcon} />
                    Назад
                </button>

                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <h2 className={styles.authTitle}>
                            {isLogin ? 'Вход в систему' : 'Регистрация'}
                        </h2>
                        <p className={styles.authSubtitle}>
                            {isLogin
                                ? 'Войдите, чтобы продолжить работу'
                                : 'Создайте аккаунт для начала работы'}
                        </p>
                    </div>

                    <div className={styles.authTabs}>
                        <button
                            className={`${styles.tabButton} ${isLogin ? styles.active : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Вход
                        </button>
                        <button
                            className={`${styles.tabButton} ${!isLogin ? styles.active : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Регистрация
                        </button>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={isLogin ? LoginSchema : RegisterSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className={styles.authForm}>
                                {!isLogin && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" className={styles.formLabel}>
                                            <FaUser className={styles.inputIcon} /> Имя
                                        </label>
                                        <Field
                                            type="text"
                                            name="name"
                                            className={`${styles.formInput} ${errors.name && touched.name ? styles.error : ''}`}
                                            placeholder="Введите ваше имя"
                                        />
                                        {errors.name && touched.name && (
                                            <div className={styles.errorMessage}>{errors.name}</div>
                                        )}
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.formLabel}>
                                        <FaEnvelope className={styles.inputIcon} /> Email
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className={`${styles.formInput} ${errors.email && touched.email ? styles.error : ''}`}
                                        placeholder="Введите ваш email"
                                    />
                                    {errors.email && touched.email && (
                                        <div className={styles.errorMessage}>{errors.email}</div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="password" className={styles.formLabel}>
                                        <FaLock className={styles.inputIcon} /> Пароль
                                    </label>
                                    <div className={styles.passwordInputWrapper}>
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className={`${styles.formInput} ${errors.password && touched.password ? styles.error : ''}`}
                                            placeholder="Введите ваш пароль"
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <div className={styles.errorMessage}>{errors.password}</div>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="confirmPassword" className={styles.formLabel}>
                                            <FaLock className={styles.inputIcon} /> Подтвердите пароль
                                        </label>
                                        <div className={styles.passwordInputWrapper}>
                                            <Field
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                className={`${styles.formInput} ${errors.confirmPassword && touched.confirmPassword ? styles.error : ''}`}
                                                placeholder="Подтвердите ваш пароль"
                                            />
                                            <button
                                                type="button"
                                                className={styles.passwordToggle}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <div className={styles.errorMessage}>{errors.confirmPassword}</div>
                                        )}
                                    </div>
                                )}

                                {isLogin && (
                                    <div className={styles.forgotPassword}>
                                        <button type="button" className={styles.forgotPasswordButton}>
                                            Забыли пароль?
                                        </button>
                                    </div>
                                )}

                                <div className={styles.formActions}>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className={styles.loadingSpinner}></div>
                                        ) : (
                                            <>
                                                {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                                <FaArrowRight className={styles.submitIcon} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {isLogin && (
                        <div className={styles.socialLogin}>
                            <div className={styles.divider}>
                                <span>или войдите с помощью</span>
                            </div>
                            <div className={styles.socialButtons}>
                                <button className={`${styles.socialButton} ${styles.google}`}>
                                    <span className={styles.socialIcon}>G</span>
                                    Google
                                </button>
                                <button className={`${styles.socialButton} ${styles.github}`}>
                                    <span className={styles.socialIcon}>GH</span>
                                    GitHub
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthPage