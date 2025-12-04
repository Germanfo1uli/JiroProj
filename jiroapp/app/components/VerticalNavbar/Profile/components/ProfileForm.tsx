import { memo, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { FaSave, FaEdit } from 'react-icons/fa';
import {AnimatePresence, motion } from 'framer-motion';
import type { ProfileFormData } from '../types/profile.types';
import { profileSchema } from '../validation/profileSchema';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
    initialData: ProfileFormData;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isLoading: boolean;
}

const EditButton = memo(() => {
    const { setFieldValue } = useFormikContext();

    const enableEditing = useCallback(() => {
        const form = document.querySelector(`.${styles.profileForm}`);
        const inputs = form?.querySelectorAll<HTMLElement>('input, textarea');
        inputs?.forEach(input => {
            input.removeAttribute('disabled');
            input.classList.remove(styles.disabled);
        });
        setFieldValue('__editing', true);
    }, [setFieldValue]);

    return (
        <motion.button
            type="button"
            className={styles.editButton}
            onClick={enableEditing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <FaEdit className={styles.editIcon} />
            Редактировать
        </motion.button>
    );
});

EditButton.displayName = 'EditButton';

export const ProfileForm = memo(({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
    const initialValues = {
        ...initialData,
        __editing: false
    };

    const handleSubmit = useCallback(async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        const { __editing, ...formData } = values;
        await onSubmit(formData as ProfileFormData);
        setSubmitting(false);
        resetForm({ values: { ...formData, __editing: false } });
    }, [onSubmit]);

    return (
        <div className={styles.profileFormContainer}>
            <Formik
                initialValues={initialValues}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, isValid, dirty, values, resetForm }) => (
                    <>
                        <div className={styles.formHeader}>
                            <h3>Информация профиля</h3>
                            {!values.__editing && !dirty && <EditButton />}
                        </div>

                        <Form className={styles.profileForm}>
                            <div className={styles.formGrid}>
                                <motion.div
                                    className={styles.formGroup}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                >
                                    <label htmlFor="name">Полное имя</label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        disabled={!values.__editing}
                                        className={!values.__editing ? styles.disabled : ''}
                                    />
                                    <ErrorMessage name="name" component="div" className={styles.errorMessage} />
                                </motion.div>

                                <motion.div
                                    className={styles.formGroup}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label htmlFor="email">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        disabled={!values.__editing}
                                        className={!values.__editing ? styles.disabled : ''}
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                                </motion.div>

                                <motion.div
                                    className={`${styles.formGroup} ${styles.fullWidth}`}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <label htmlFor="bio">О себе</label>
                                    <Field
                                        id="bio"
                                        name="bio"
                                        as="textarea"
                                        disabled={!values.__editing}
                                        className={!values.__editing ? styles.disabled : ''}
                                        rows={3}
                                        placeholder="Расскажите о себе..."
                                    />
                                    <ErrorMessage name="bio" component="div" className={styles.errorMessage} />
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {values.__editing && (
                                    <motion.div
                                        className={styles.formActions}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                const inputs = document.querySelectorAll('input, textarea');
                                                inputs.forEach(input => {
                                                    (input as HTMLElement).setAttribute('disabled', 'true');
                                                    (input as HTMLElement).classList.add(styles.disabled);
                                                });
                                            }}
                                            className={styles.cancelButton}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Отмена
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            className={styles.saveButton}
                                            disabled={isSubmitting || !isValid || isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FaSave className={styles.saveIcon} />
                                            {isSubmitting || isLoading ? 'Сохранение...' : 'Сохранить'}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    );
});

ProfileForm.displayName = 'ProfileForm';