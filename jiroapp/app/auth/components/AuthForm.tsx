import { Form, Field, FormikHelpers } from 'formik'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FormValues } from '../types/auth'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthForm.module.css'

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

interface FormTouched {
    name?: boolean
    email?: boolean
    password?: boolean
    confirmPassword?: boolean
}

interface AuthFormProps {
    isLogin: boolean
    errors: FormErrors
    touched: FormTouched
    isSubmitting: boolean
}

function AuthForm({ isLogin, errors, touched, isSubmitting }: AuthFormProps) {
    const { showPassword, showConfirmPassword, togglePasswordVisibility, toggleConfirmPasswordVisibility } = useAuth()

    const inputVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    }

    return (
        <Form className={styles.authForm} noValidate>
            {!isLogin && (
                <motion.div
                    className={styles.formGroup}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: 0.1 }}
                >
                    <label htmlFor="name" className={styles.formLabel}>
                        <FaUser className={styles.inputIcon} aria-hidden="true" />
                        Имя
                    </label>
                    <Field
                        id="name"
                        name="name"
                        type="text"
                        className={`${styles.formInput} ${errors.name && touched.name ? styles.error : ''}`}
                        placeholder="Введите ваше имя"
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!(errors.name && touched.name)}
                        aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                    />
                    {errors.name && touched.name && (
                        <motion.div
                            id="name-error"
                            className={styles.errorMessage}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.2 }}
                        >
                            {errors.name}
                        </motion.div>
                    )}
                </motion.div>
            )}

            <motion.div
                className={styles.formGroup}
                variants={inputVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: 0.2 }}
            >
                <label htmlFor="email" className={styles.formLabel}>
                    <FaEnvelope className={styles.inputIcon} aria-hidden="true" />
                    Email
                </label>
                <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`${styles.formInput} ${errors.email && touched.email ? styles.error : ''}`}
                    placeholder="Введите ваш email"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!(errors.email && touched.email)}
                    aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                />
                {errors.email && touched.email && (
                    <motion.div
                        id="email-error"
                        className={styles.errorMessage}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                    >
                        {errors.email}
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className={styles.formGroup}
                variants={inputVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: 0.3 }}
            >
                <label htmlFor="password" className={styles.formLabel}>
                    <FaLock className={styles.inputIcon} aria-hidden="true" />
                    Пароль
                </label>
                <div className={styles.passwordInputWrapper}>
                    <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`${styles.formInput} ${errors.password && touched.password ? styles.error : ''}`}
                        placeholder="Введите ваш пароль"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        aria-required="true"
                        aria-invalid={!!(errors.password && touched.password)}
                        aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                    />
                    <motion.button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={togglePasswordVisibility}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.button>
                </div>
                {errors.password && touched.password && (
                    <motion.div
                        id="password-error"
                        className={styles.errorMessage}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                    >
                        {errors.password}
                    </motion.div>
                )}
            </motion.div>

            {!isLogin && (
                <motion.div
                    className={styles.formGroup}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: 0.4 }}
                >
                    <label htmlFor="confirmPassword" className={styles.formLabel}>
                        <FaLock className={styles.inputIcon} aria-hidden="true" />
                        Подтвердите пароль
                    </label>
                    <div className={styles.passwordInputWrapper}>
                        <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className={`${styles.formInput} ${errors.confirmPassword && touched.confirmPassword ? styles.error : ''}`}
                            placeholder="Подтвердите ваш пароль"
                            autoComplete="new-password"
                            aria-required="true"
                            aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
                            aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirm-error' : undefined}
                        />
                        <motion.button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={toggleConfirmPasswordVisibility}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                            aria-pressed={showConfirmPassword}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </motion.button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                        <motion.div
                            id="confirm-error"
                            className={styles.errorMessage}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.2 }}
                        >
                            {errors.confirmPassword}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {isLogin && (
                <motion.div
                    className={styles.forgotPassword}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                >
                    <motion.button
                        type="button"
                        className={styles.forgotPasswordButton}
                        whileHover={{ x: 5 }}
                    >
                        Забыли пароль?
                    </motion.button>
                </motion.div>
            )}

            <motion.div
                className={styles.formActions}
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
            >
                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className={styles.loadingSpinner} aria-label="Загрузка" />
                    ) : (
                        <>
                            <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
                            <FaArrowRight className={styles.submitIcon} aria-hidden="true" />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </Form>
    )
}

export default AuthForm