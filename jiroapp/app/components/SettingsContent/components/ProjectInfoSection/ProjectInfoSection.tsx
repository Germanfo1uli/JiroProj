import { Field, ErrorMessage } from 'formik';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './ProjectInfoSection.module.css';

const ProjectInfoSection = () => {
    return (
        <div className={styles.projectInfoSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Основная информация</h3>
                <p className={styles.sectionSubtitle}>
                    Настройте базовые параметры вашего проекта
                </p>
            </div>

            <div className={styles.formContent}>
                <div className={styles.formGroup}>
                    <label htmlFor="projectName" className={styles.label}>
                        Название проекта *
                    </label>
                    <Field
                        type="text"
                        id="projectName"
                        name="projectName"
                        placeholder="Введите название проекта"
                        className={styles.input}
                    />
                    <ErrorMessage name="projectName" component="div" className={styles.error} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>
                        Описание проекта
                    </label>
                    <Field
                        as="textarea"
                        id="description"
                        name="description"
                        placeholder="Опишите цель, задачи и особенности вашего проекта..."
                        rows={6}
                        className={styles.textarea}
                    />
                    <div className={styles.textareaFooter}>
                        <div className={styles.helperText}>
                            Расскажите о проекте новым участникам
                        </div>
                        <div className={styles.charCount}>
                            <Field>
                                {({ form }: any) => `${form.values.description?.length || 0}/500`}
                            </Field>
                        </div>
                    </div>
                    <ErrorMessage name="description" component="div" className={styles.error} />
                </div>

                <div className={styles.infoCard}>
                    <FaInfoCircle className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                        <strong>Совет:</strong> Подробное описание помогает новым участникам
                        быстрее понять цели проекта и начать эффективную работу.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfoSection;