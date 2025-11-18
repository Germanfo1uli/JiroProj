import { Field, ErrorMessage } from 'formik';
import styles from './ProjectInfoSection.module.css';

const ProjectInfoSection = () => {
    return (
        <div className={styles.projectInfoSection}>
            <h3 className={styles.sectionTitle}>Информация о проекте</h3>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="projectName" className={styles.label}>
                        Название проекта
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
                    <label htmlFor="capacity" className={styles.label}>
                        Вместимость команды
                    </label>
                    <Field
                        type="number"
                        id="capacity"
                        name="capacity"
                        min="1"
                        max="100"
                        placeholder="Количество участников"
                        className={styles.input}
                    />
                    <ErrorMessage name="capacity" component="div" className={styles.error} />
                </div>

                <div className={styles.formGroupFull}>
                    <label htmlFor="description" className={styles.label}>
                        Описание проекта
                    </label>
                    <Field
                        as="textarea"
                        id="description"
                        name="description"
                        placeholder="Опишите цель и особенности вашего проекта..."
                        rows={4}
                        className={styles.textarea}
                    />
                    <div className={styles.helperText}>
                        Необязательное поле. Максимум 500 символов.
                    </div>
                    <ErrorMessage name="description" component="div" className={styles.error} />
                </div>
            </div>
        </div>
    );
};

export default ProjectInfoSection;