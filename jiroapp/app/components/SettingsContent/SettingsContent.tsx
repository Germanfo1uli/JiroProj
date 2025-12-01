'use client'

import { Formik, Form } from 'formik';
import { FaSave, FaCog, FaUsers, FaUserTag, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { settingsValidationSchema } from './utils/validationSchemas';
import { useSettingsForm } from './hooks/useSettingsForm';
import { ProjectSettings } from './types/settings';
import AvatarSection from './components/AvatarSection/AvatarSection';
import ProjectInfoSection from './components/ProjectInfoSection/ProjectInfoSection';
import InviteSection from './components/InviteSection/InviteSection';
import RolesSection from './components/RolesSection/RolesSection';
import DeleteProjectModal from './components/DeleteProjectModal/DeleteProjectModal';
import styles from './SettingsContent.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const SettingsContent = () => {
    const initialSettings: ProjectSettings = {
        avatar: '',
        projectName: 'TASKFLOW PRO',
        description: 'Система управления задачами нового поколения. Организуйте работу вашей команды эффективно и просто.',
        inviteLink: 'https://taskflow.ru/invite/abc123-def456-ghi789'
    };

    const { settings, handleSubmit, copyInviteLink, refreshInviteLink } = useSettingsForm(initialSettings);
    const [activeTab, setActiveTab] = useState('general');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const tabs = [
        { id: 'general', label: 'Основные', icon: <FaCog /> },
        { id: 'roles', label: 'Роли и доступы', icon: <FaUserTag /> },
        { id: 'team', label: 'Команда', icon: <FaUsers /> }
    ];

    const handleDeleteProject = () => {
        console.log('Удаление проекта...');
        setShowDeleteModal(false);
        // Здесь будет логика удаления проекта
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.settingsContent}
        >
            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={styles.headerContent}
                    >
                        <div className={styles.titleWrapper}>
                            <h1 className={styles.pageTitle}>
                                <span className={styles.titleGradient}>Настройки проекта</span>
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Управление базовой информацией, ролями и доступом участников
                            </p>
                        </div>

                        <div className={styles.headerStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>4</span>
                                <span className={styles.statLabel}>активных участника</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>3</span>
                                <span className={styles.statLabel}>роли</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>12</span>
                                <span className={styles.statLabel}>выполненных задач</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={styles.settingsTabs}
                    >
                        <div className={styles.tabsContainer}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className={styles.tabIcon}>{tab.icon}</span>
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={styles.tabIndicator}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className={styles.settingsMain}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'general' && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.generalTab}
                            >
                                <Formik
                                    initialValues={settings}
                                    validationSchema={settingsValidationSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting, dirty, isValid, resetForm }) => (
                                        <Form className={styles.settingsForm}>
                                            <div className={styles.formGrid}>
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                    className={styles.formColumn}
                                                >
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
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className={styles.formColumn}
                                                >
                                                    <div className={styles.formSection}>
                                                        <ProjectInfoSection />
                                                    </div>

                                                    {/* Danger Zone теперь в колонке с основной информацией */}
                                                    <div className={styles.dangerZone}>
                                                        <div className={styles.dangerHeader}>
                                                            <FaExclamationTriangle className={styles.dangerIcon} />
                                                            <h3 className={styles.dangerTitle}>Опасная зона</h3>
                                                        </div>
                                                        <p className={styles.dangerDescription}>
                                                            Удаление проекта приведет к безвозвратному удалению всех данных.
                                                        </p>
                                                        <motion.button
                                                            type="button"
                                                            className={styles.deleteProjectButton}
                                                            onClick={() => setShowDeleteModal(true)}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <FaTrash className={styles.deleteIcon} />
                                                            Удалить проект
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <div className={styles.bottomActions}>
                                                <AnimatePresence>
                                                    {dirty && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            className={styles.formActions}
                                                        >
                                                            <div className={styles.actionsContainer}>
                                                                <div className={styles.unsavedChanges}>
                                                                    <motion.div
                                                                        animate={{ scale: [1, 1.2, 1] }}
                                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                                        className={styles.changeDot}
                                                                    />
                                                                    Есть несохранённые изменения
                                                                </div>
                                                                <div className={styles.actionButtons}>
                                                                    <motion.button
                                                                        type="button"
                                                                        className={styles.cancelButton}
                                                                        onClick={() => resetForm()}
                                                                        disabled={isSubmitting}
                                                                        whileHover={{ scale: 1.02 }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                    >
                                                                        Отменить
                                                                    </motion.button>
                                                                    <motion.button
                                                                        type="submit"
                                                                        className={styles.saveButton}
                                                                        disabled={!isValid || isSubmitting}
                                                                        whileHover={{ scale: 1.02 }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                    >
                                                                        <FaSave className={styles.saveIcon} />
                                                                        {isSubmitting ? (
                                                                            <motion.span
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                            >
                                                                                Сохранение...
                                                                            </motion.span>
                                                                        ) : (
                                                                            'Сохранить изменения'
                                                                        )}
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </motion.div>
                        )}

                        {activeTab === 'roles' && (
                            <motion.div
                                key="roles"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RolesSection />
                            </motion.div>
                        )}

                        {activeTab === 'team' && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className={styles.placeholderContent}
                            >
                                <div className={styles.placeholderCard}>
                                    <FaUsers className={styles.placeholderIcon} />
                                    <h3>Управление командой</h3>
                                    <p>Настройки участников и ролей будут доступны в этом разделе</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <DeleteProjectModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteProject}
                projectName={settings.projectName}
            />
        </motion.div>
    );
};

export default SettingsContent;