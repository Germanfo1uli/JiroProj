import { useState } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUserShield,
    FaCheck, FaUserTag, FaLock, FaTasks, FaUsers, FaChartLine,
    FaEye, FaEyeSlash, FaKey
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RolesSection.module.css';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: {
        viewTasks: boolean;
        createTasks: boolean;
        editTasks: boolean;
        deleteTasks: boolean;
        manageUsers: boolean;
        manageRoles: boolean;
        viewAnalytics: boolean;
        editSettings: boolean;
    };
    memberCount: number;
    isDefault: boolean;
}

interface PermissionItem {
    key: keyof Role['permissions'];
    label: string;
    description: string;
    icon: JSX.Element;
    category: string;
}

const RolesSection = () => {
    const [roles, setRoles] = useState<Role[]>([
        {
            id: 'admin',
            name: 'Администратор',
            description: 'Полный доступ ко всем функциям системы',
            permissions: {
                viewTasks: true,
                createTasks: true,
                editTasks: true,
                deleteTasks: true,
                manageUsers: true,
                manageRoles: true,
                viewAnalytics: true,
                editSettings: true
            },
            memberCount: 1,
            isDefault: true
        },
        {
            id: 'manager',
            name: 'Менеджер',
            description: 'Управление задачами и командой, без доступа к системным настройкам',
            permissions: {
                viewTasks: true,
                createTasks: true,
                editTasks: true,
                deleteTasks: false,
                manageUsers: true,
                manageRoles: false,
                viewAnalytics: true,
                editSettings: false
            },
            memberCount: 2,
            isDefault: false
        },
        {
            id: 'developer',
            name: 'Разработчик',
            description: 'Выполнение и отслеживание задач',
            permissions: {
                viewTasks: true,
                createTasks: true,
                editTasks: true,
                deleteTasks: false,
                manageUsers: false,
                manageRoles: false,
                viewAnalytics: false,
                editSettings: false
            },
            memberCount: 3,
            isDefault: false
        }
    ]);

    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

    const permissionsList: PermissionItem[] = [
        {
            key: 'viewTasks',
            label: 'Просмотр задач',
            description: 'Возможность просматривать все задачи проекта',
            icon: <FaEye />,
            category: 'Задачи'
        },
        {
            key: 'createTasks',
            label: 'Создание задач',
            description: 'Возможность создавать новые задачи',
            icon: <FaPlus />,
            category: 'Задачи'
        },
        {
            key: 'editTasks',
            label: 'Редактирование задач',
            description: 'Возможность редактировать существующие задачи',
            icon: <FaEdit />,
            category: 'Задачи'
        },
        {
            key: 'deleteTasks',
            label: 'Удаление задач',
            description: 'Возможность удалять задачи',
            icon: <FaTrash />,
            category: 'Задачи'
        },
        {
            key: 'manageUsers',
            label: 'Управление пользователями',
            description: 'Добавление, удаление и редактирование участников',
            icon: <FaUsers />,
            category: 'Команда'
        },
        {
            key: 'manageRoles',
            label: 'Управление ролями',
            description: 'Изменение ролей участников',
            icon: <FaUserTag />,
            category: 'Команда'
        },
        {
            key: 'viewAnalytics',
            label: 'Просмотр аналитики',
            description: 'Доступ к статистике и отчетам',
            icon: <FaChartLine />,
            category: 'Аналитика'
        },
        {
            key: 'editSettings',
            label: 'Изменение настроек',
            description: 'Изменение общих настроек проекта',
            icon: <FaLock />,
            category: 'Система'
        }
    ];

    const handleCreateRole = () => {
        const newRole: Role = {
            id: `role_${Date.now()}`,
            name: 'Новая роль',
            description: 'Описание новой роли',
            permissions: {
                viewTasks: true,
                createTasks: false,
                editTasks: false,
                deleteTasks: false,
                manageUsers: false,
                manageRoles: false,
                viewAnalytics: false,
                editSettings: false
            },
            memberCount: 0,
            isDefault: false
        };
        setEditingRole(newRole);
        setIsCreating(true);
    };

    const handleEditRole = (role: Role) => {
        setEditingRole({ ...role });
        setIsCreating(false);
    };

    const handleSaveRole = () => {
        if (!editingRole) return;

        if (isCreating) {
            setRoles([...roles, editingRole]);
        } else {
            setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role));
        }

        setEditingRole(null);
    };

    const handleDeleteRole = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        if (role?.isDefault) {
            alert('Нельзя удалить роль по умолчанию');
            return;
        }
        setDeletingRoleId(roleId);
    };

    const confirmDelete = () => {
        if (!deletingRoleId) return;
        setRoles(roles.filter(role => role.id !== deletingRoleId));
        setDeletingRoleId(null);
    };

    const handlePermissionToggle = (permissionKey: keyof Role['permissions']) => {
        if (!editingRole) return;
        setEditingRole({
            ...editingRole,
            permissions: {
                ...editingRole.permissions,
                [permissionKey]: !editingRole.permissions[permissionKey]
            }
        });
    };

    const toggleAllPermissions = (category: string, value: boolean) => {
        if (!editingRole) return;

        const categoryPermissions = permissionsList
            .filter(p => p.category === category)
            .map(p => p.key);

        const updatedPermissions = { ...editingRole.permissions };
        categoryPermissions.forEach(key => {
            updatedPermissions[key] = value;
        });

        setEditingRole({
            ...editingRole,
            permissions: updatedPermissions
        });
    };

    const getPermissionCount = (role: Role) => {
        return Object.values(role.permissions).filter(Boolean).length;
    };

    const getPermissionGroups = () => {
        const groups: { [key: string]: PermissionItem[] } = {};
        permissionsList.forEach(permission => {
            if (!groups[permission.category]) {
                groups[permission.category] = [];
            }
            groups[permission.category].push(permission);
        });
        return groups;
    };

    return (
        <div className={styles.rolesSection}>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.sectionHeader}
            >
                <h2 className={styles.sectionTitle}>
                    <FaUserTag className={styles.titleIcon} />
                    Управление ролями
                </h2>
                <p className={styles.sectionSubtitle}>
                    Создавайте, редактируйте и настраивайте права доступа для разных ролей в проекте
                </p>
            </motion.div>

            <div className={styles.rolesContent}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.rolesHeader}
                >
                    <div className={styles.headerInfo}>
                        <h3 className={styles.headerTitle}>
                            <FaUserShield className={styles.headerIcon} />
                            Список ролей
                        </h3>
                        <p className={styles.headerDescription}>
                            {roles.length} ролей • {getPermissionCount(roles.find(r => r.id === 'admin') || roles[0])} доступов у администратора
                        </p>
                    </div>
                    <motion.button
                        className={styles.createButton}
                        onClick={handleCreateRole}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaPlus className={styles.buttonIcon} />
                        Создать роль
                    </motion.button>
                </motion.div>

                <div className={styles.rolesGrid}>
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.roleCard}
                        >
                            <div className={styles.roleHeader}>
                                <div className={styles.roleTitle}>
                                    <h4 className={styles.roleName}>
                                        <FaUserTag className={styles.roleIcon} />
                                        {role.name}
                                        {role.isDefault && (
                                            <span className={styles.defaultBadge}>По умолчанию</span>
                                        )}
                                    </h4>
                                    <div className={styles.roleStats}>
                                        <span className={styles.statItem}>
                                            <FaUsers className={styles.statIcon} />
                                            {role.memberCount} участников
                                        </span>
                                        <span className={styles.statItem}>
                                            <FaKey className={styles.statIcon} />
                                            {getPermissionCount(role)} доступов
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.roleActions}>
                                    <motion.button
                                        className={styles.editButton}
                                        onClick={() => handleEditRole(role)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Редактировать роль"
                                    >
                                        <FaEdit />
                                    </motion.button>
                                    {!role.isDefault && (
                                        <motion.button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteRole(role.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Удалить роль"
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            <p className={styles.roleDescription}>{role.description}</p>

                            <div className={styles.permissionsPreview}>
                                <div className={styles.permissionsHeader}>
                                    <span className={styles.permissionsTitle}>
                                        <FaLock className={styles.permissionsIcon} />
                                        Основные доступы
                                    </span>
                                </div>
                                <div className={styles.permissionsList}>
                                    {permissionsList.slice(0, 4).map(permission => (
                                        <div
                                            key={permission.key}
                                            className={`${styles.permissionItem} ${
                                                role.permissions[permission.key] ? styles.permissionActive : styles.permissionInactive
                                            }`}
                                        >
                                            {permission.icon}
                                            <span className={styles.permissionLabel}>
                                                {role.permissions[permission.key] ? permission.label : 'Нет доступа'}
                                            </span>
                                        </div>
                                    ))}
                                    {Object.values(role.permissions).filter(Boolean).length > 4 && (
                                        <div className={styles.morePermissions}>
                                            +{Object.values(role.permissions).filter(Boolean).length - 4} других доступов
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={styles.permissionsInfo}
                >
                    <div className={styles.infoCard}>
                        <FaUserShield className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                            <h4 className={styles.infoTitle}>Как работают роли?</h4>
                            <p className={styles.infoText}>
                                Роли определяют, какие действия могут выполнять участники в проекте.
                                Настройте права доступа для каждой роли в соответствии с обязанностями участников.
                            </p>
                            <ul className={styles.infoTips}>
                                <li>Администратор имеет полный доступ ко всем функциям</li>
                                <li>Изменения ролей применяются ко всем участникам с этой ролью</li>
                                <li>Роль по умолчанию нельзя удалить</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {editingRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.editModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={styles.modalContent}
                        >
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>
                                    <FaUserTag className={styles.modalIcon} />
                                    {isCreating ? 'Создание новой роли' : 'Редактирование роли'}
                                </h3>
                                <button
                                    className={styles.modalClose}
                                    onClick={() => setEditingRole(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.roleForm}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Название роли *
                                        </label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            value={editingRole.name}
                                            onChange={(e) => setEditingRole({
                                                ...editingRole,
                                                name: e.target.value
                                            })}
                                            placeholder="Введите название роли"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Описание роли
                                        </label>
                                        <textarea
                                            className={styles.formTextarea}
                                            value={editingRole.description}
                                            onChange={(e) => setEditingRole({
                                                ...editingRole,
                                                description: e.target.value
                                            })}
                                            placeholder="Опишите назначение роли"
                                            rows={3}
                                        />
                                    </div>

                                    <div className={styles.permissionsSection}>
                                        <h4 className={styles.permissionsTitle}>
                                            <FaLock className={styles.permissionsTitleIcon} />
                                            Настройка прав доступа
                                            <span className={styles.permissionsCount}>
                                                {getPermissionCount(editingRole)} из {permissionsList.length} доступов
                                            </span>
                                        </h4>
                                        <p className={styles.permissionsDescription}>
                                            Выберите права, которые будут доступны участникам с этой ролью
                                        </p>

                                        <div className={styles.permissionsGrid}>
                                            {Object.entries(getPermissionGroups()).map(([category, categoryPermissions]) => (
                                                <div key={category} className={styles.permissionCategory}>
                                                    <div className={styles.categoryHeader}>
                                                        <h5 className={styles.categoryTitle}>
                                                            {category}
                                                            <span className={styles.categoryCount}>
                                                                {categoryPermissions.filter(p => editingRole.permissions[p.key]).length}/
                                                                {categoryPermissions.length}
                                                            </span>
                                                        </h5>
                                                        <div className={styles.categoryActions}>
                                                            <button
                                                                className={styles.categoryAction}
                                                                onClick={() => toggleAllPermissions(category, true)}
                                                            >
                                                                Выбрать все
                                                            </button>
                                                            <button
                                                                className={styles.categoryAction}
                                                                onClick={() => toggleAllPermissions(category, false)}
                                                            >
                                                                Очистить все
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={styles.categoryPermissions}>
                                                        {categoryPermissions.map(permission => (
                                                            <div
                                                                key={permission.key}
                                                                className={styles.permissionOption}
                                                            >
                                                                <div className={styles.permissionInfo}>
                                                                    <div className={styles.permissionIcon}>
                                                                        {permission.icon}
                                                                    </div>
                                                                    <div className={styles.permissionDetails}>
                                                                        <span className={styles.permissionName}>
                                                                            {permission.label}
                                                                        </span>
                                                                        <span className={styles.permissionDesc}>
                                                                            {permission.description}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <label className={styles.permissionToggle}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={editingRole.permissions[permission.key]}
                                                                        onChange={() => handlePermissionToggle(permission.key)}
                                                                        className={styles.toggleInput}
                                                                    />
                                                                    <span className={styles.toggleSlider} />
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.modalCancel}
                                    onClick={() => setEditingRole(null)}
                                >
                                    Отмена
                                </button>
                                <motion.button
                                    className={styles.modalSave}
                                    onClick={handleSaveRole}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaSave className={styles.saveIcon} />
                                    {isCreating ? 'Создать роль' : 'Сохранить изменения'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deletingRoleId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.deleteModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={styles.deleteContent}
                        >
                            <div className={styles.deleteHeader}>
                                <FaUserShield className={styles.deleteIcon} />
                                <h3 className={styles.deleteTitle}>Удаление роли</h3>
                            </div>

                            <div className={styles.deleteBody}>
                                <p className={styles.deleteText}>
                                    Вы уверены, что хотите удалить роль "{roles.find(r => r.id === deletingRoleId)?.name}"?
                                </p>
                                <p className={styles.deleteWarning}>
                                    Это действие нельзя отменить. Все участники с этой ролью будут переназначены на роль по умолчанию.
                                </p>
                            </div>

                            <div className={styles.deleteFooter}>
                                <button
                                    className={styles.deleteCancel}
                                    onClick={() => setDeletingRoleId(null)}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.deleteConfirm}
                                    onClick={confirmDelete}
                                >
                                    <FaTrash className={styles.deleteConfirmIcon} />
                                    Удалить
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RolesSection;