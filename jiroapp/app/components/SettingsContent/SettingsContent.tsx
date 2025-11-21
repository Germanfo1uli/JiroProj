'use client'

import { Formik, Form } from 'formik';
import { FaSave } from 'react-icons/fa';
import { settingsValidationSchema } from './utils/validationSchemas';
import { useSettingsForm } from './hooks/useSettingsForm';
import { ProjectSettings } from './types/settings';
import AvatarSection from './components/AvatarSection/AvatarSection';
import ProjectInfoSection from './components/ProjectInfoSection/ProjectInfoSection';
import InviteSection from './components/InviteSection/InviteSection';
import styles from './SettingsContent.module.css';

const SettingsContent = () => {
    const initialSettings: ProjectSettings = {
        avatar: '',
        projectName: 'TASKFLOW PRO',
        description: 'Система управления задачами нового поколения. Организуйте работу вашей команды эффективно и просто.',
        inviteLink: 'https://taskflow.ru/invite/abc123-def456-ghi789'
    };

    const { settings, handleSubmit, copyInviteLink, refreshInviteLink } = useSettingsForm(initialSettings);

    return (
        <div className={styles.settingsContent}>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.pageTitle}>Настройки проекта</h1>
                        <p className={styles.pageSubtitle}>
                            Управление базовой информацией проекта, настройками команды и доступом
                        </p>
                    </div>
                </div>
                <div className={styles.settingsMain}>
                    <Formik
                        initialValues={settings}
                        validationSchema={settingsValidationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, dirty, isValid, resetForm }) => (
                            <Form className={styles.settingsForm}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formColumn}>
                                        <div className={styles.formSection}>
                                            <AvatarSection currentAvatar={initialSettings.avatar} />
                                        </div>

                                        <div className={styles.formSection}>
                                            <InviteSection
                                                inviteLink={settings.inviteLink}
                                                onCopyLink={copyInviteLink}
                                                onRefreshLink={refreshInviteLink}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formColumn}>
                                        <div className={styles.formSection}>
                                            <ProjectInfoSection />
                                        </div>
                                    </div>
                                </div>

                                {dirty && (
                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.cancelButton}
                                            onClick={() => resetForm()}
                                            disabled={isSubmitting}
                                        >
                                            Отменить изменения
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.saveButton}
                                            disabled={!isValid || isSubmitting}
                                        >
                                            <FaSave className={styles.saveIcon} />
                                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                                        </button>
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;