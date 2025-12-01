import { Field, ErrorMessage, useFormikContext } from 'formik';
import { FaInfoCircle, FaLightbulb, FaChartLine } from 'react-icons/fa';
import styles from './ProjectInfoSection.module.css';
import { motion } from 'framer-motion';

const ProjectInfoSection = () => {
    const { values } = useFormikContext<any>();

    return (
        <div className={styles.projectInfoSection}>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.sectionHeader}
            >
                <h3 className={styles.sectionTitle}>
                    Основная информация
                </h3>
                <p className={styles.sectionSubtitle}>
                    Настройте базовые параметры вашего проекта
                </p>
            </motion.div>

            <div className={styles.formContent}>
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.formGroup}
                >
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
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={styles.formGroup}
                >
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
                            <FaLightbulb className={styles.helperIcon} />
                            Расскажите о проекте новым участникам
                        </div>
                        <div className={styles.charCount}>
                            <motion.span
                                key={values.description?.length || 0}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className={values.description?.length > 450 ? styles.charWarning : ''}
                            >
                                {values.description?.length || 0}/500
                            </motion.span>
                        </div>
                    </div>
                    <ErrorMessage name="description" component="div" className={styles.error} />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={styles.infoCard}
                >
                    <div className={styles.infoHeader}>
                        <FaInfoCircle className={styles.infoIcon} />
                        <span className={styles.infoTitle}>Совет по оптимизации</span>
                    </div>
                    <div className={styles.infoContent}>
                        Подробное описание помогает новым участникам
                        быстрее понять цели проекта и начать эффективную работу.
                    </div>
                    <div className={styles.infoStats}>
                        <div className={styles.statItem}>
                            <FaChartLine className={styles.statIcon} />
                            <span>+40% к пониманию задач</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectInfoSection;