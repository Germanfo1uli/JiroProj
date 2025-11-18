'use client'

import { Formik, Form } from 'formik';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { settingsValidationSchema } from './utils/validationSchemas';
import { useSettingsForm } from './hooks/useSettingsForm';
import { ProjectSettings } from './types/settings';
import AvatarSection from './components/AvatarSection/AvatarSection';
import ProjectInfoSection from './components/ProjectInfoSection/ProjectInfoSection';
import InviteSection from './components/InviteSection/InviteSection';
import styles from './SettingsContent.module.css';

interface SettingsContentProps {
    onBackClick?: () => void;
}

const SettingsContent = ({ onBackClick }: SettingsContentProps) => {
    const initialSettings: ProjectSettings = {
        avatar: '',
        projectName: 'TASKFLOW PRO',
        capacity: 10,
        description: 'Система управления задачами нового поколения',
        inviteLink: 'https://taskflow.ru/invite/abc123-def456-ghi789'
    };

    const { settings, handleSubmit, copyInviteLink } = useSettingsForm(initialSettings);

    return (
        <div className={styles.settingsContent}>
            <div className={styles.settingsContainer}>
                {/* Header */}
                <div className={styles.settingsHeader}>
                    <div className={styles.headerMain}>
                        <button
                            className={styles.backButton}
                            onClick={onBackClick}
                        >
                            <FaArrowLeft className={styles.backIcon} />
                        </button>
                        <div className={styles.headerText}>
                            <h1 className={styles.pageTitle}>Настройки проекта</h1>
                            <p className={styles.pageSubtitle}>Управление базовой информацией и настройками доступа</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.settingsMain}>
                    <Formik
                        initialValues={settings}
                        validationSchema={settingsValidationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, dirty, isValid, resetForm }) => (
                            <Form className={styles.settingsForm}>
                                <div className={styles.formContent}>
                                    <div className={styles.formSection}>
                                        <AvatarSection currentAvatar={initialSettings.avatar} />
                                    </div>

                                    <div className={styles.formSection}>
                                        <ProjectInfoSection />
                                    </div>

                                    <div className={styles.formSection}>
                                        <InviteSection
                                            inviteLink={settings.inviteLink}
                                            onCopyLink={copyInviteLink}
                                        />
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
                                            Отменить
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