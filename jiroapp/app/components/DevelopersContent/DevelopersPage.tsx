'use client'

import { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import { FaUserPlus, FaSync } from 'react-icons/fa';
import { Developer, NewDeveloper } from './types/developer.types';
import { mockDevelopers } from './data/mockDevelopers';
import { DevelopersTable } from './components/DevelopersTable';
import { AddDeveloperDialog } from './components/AddDeveloperDialog';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { useDeveloperProjects } from './hooks/useDeveloperProjects';
import { useDashboard } from '../DashboardContent/hooks/useDashboard';
import styles from './DevelopersPage.module.css';

export const DevelopersPage = () => {
    const [developers, setDevelopers] = useState<Developer[]>(mockDevelopers);
    const [isAddDeveloperOpen, setIsAddDeveloperOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        developerId: number | null;
        developerName: string;
    }>({
        isOpen: false,
        developerId: null,
        developerName: ''
    });
    const [snackbar, setSnackbar] = useState<{
        isOpen: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        isOpen: false,
        message: '',
        severity: 'success'
    });

    const [newDeveloper, setNewDeveloper] = useState<NewDeveloper>({
        name: '',
        role: 'executor'
    });

    const { getDeveloperProjects } = useDeveloperProjects();
    const { boards } = useDashboard();
    const isLeader = developers.some(dev => dev.isCurrentUser && dev.role === 'leader');

    const updateAllDeveloperProjects = () => {
        setIsRefreshing(true);

        const updatedDevelopers = developers.map(developer => ({
            ...developer,
            projects: getDeveloperProjects(developer),
            completedTasks: calculateCompletedTasks(developer.name)
        }));

        setDevelopers(updatedDevelopers);

        setTimeout(() => {
            setIsRefreshing(false);
            showSnackbar('Данные разработчиков обновлены', 'success');
        }, 500);
    };

    const calculateCompletedTasks = (developerName: string): number => {
        let completedTasks = 0;

        boards.forEach(board => {
            if (board.title === 'Done') {
                board.cards?.forEach(card => {
                    if (card.author.name === developerName) {
                        completedTasks++;
                    }
                });
            }
        });

        return completedTasks;
    };

    useEffect(() => {
        updateAllDeveloperProjects();
    }, [boards]);

    useEffect(() => {
        updateAllDeveloperProjects();
    }, []);

    const handleAddDeveloper = (developerData: NewDeveloper) => {
        const newDev: Developer = {
            id: Math.max(0, ...developers.map(d => d.id)) + 1,
            name: developerData.name,
            avatar: null,
            role: developerData.role,
            completedTasks: calculateCompletedTasks(developerData.name),
            projects: getDeveloperProjects({
                name: developerData.name,
                role: developerData.role,
                completedTasks: 0,
                projects: [],
                avatar: null,
                id: 0
            })
        };

        setDevelopers(prev => [...prev, newDev]);
        setNewDeveloper({ name: '', role: 'executor' });
        setIsAddDeveloperOpen(false);
        showSnackbar(`Участник ${developerData.name} добавлен в проект`, 'success');
    };

    const handleRemoveDeveloper = (developerId: number) => {
        const developer = developers.find(dev => dev.id === developerId);
        if (developer) {
            setDeleteConfirmation({
                isOpen: true,
                developerId,
                developerName: developer.name
            });
        }
    };

    const confirmDelete = () => {
        if (deleteConfirmation.developerId) {
            const developerName = developers.find(dev => dev.id === deleteConfirmation.developerId)?.name;
            setDevelopers(prev => prev.filter(dev => dev.id !== deleteConfirmation.developerId));
            setDeleteConfirmation({ isOpen: false, developerId: null, developerName: '' });
            showSnackbar(`Участник ${developerName} удален из проекта`, 'success');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ isOpen: false, developerId: null, developerName: '' });
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ isOpen: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, isOpen: false });
    };

    const handleManualRefresh = () => {
        updateAllDeveloperProjects();
    };

    return (
        <div className={styles.developersSection}>
            <div className={styles.developersHeader}>
                <div className={styles.headerTop}>
                    <div className={styles.titleSection}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <h1 className={styles.pageTitle}>Команда разработчиков</h1>
                            <Button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                startIcon={isRefreshing ? <CircularProgress size={16} /> : <FaSync />}
                                sx={{
                                    minWidth: 'auto',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    '&:hover': {
                                        background: 'rgba(59, 130, 246, 0.2)',
                                    },
                                    '& .MuiButton-startIcon': {
                                        marginRight: '6px'
                                    }
                                }}
                            >
                                {isRefreshing ? 'Обновление...' : 'Обновить'}
                            </Button>
                        </Box>
                        <p className={styles.pageSubtitle}>
                            Управление участниками проекта и их ролями в системе.
                            Проекты и задачи автоматически обновляются при изменении данных.
                            {isRefreshing && ' (Обновление...)'}
                        </p>
                    </div>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLeader && (
                            <Button
                                variant="contained"
                                startIcon={<FaUserPlus />}
                                onClick={() => setIsAddDeveloperOpen(true)}
                                className={styles.addDeveloperBtn}
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                                    borderRadius: '14px',
                                    padding: '12px 28px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Добавить участника
                            </Button>
                        )}
                    </Box>
                </div>
            </div>

            <div className={styles.developersContent}>
                <DevelopersTable
                    developers={developers}
                    isLeader={isLeader}
                    onRemoveDeveloper={handleRemoveDeveloper}
                />
            </div>

            <AddDeveloperDialog
                open={isAddDeveloperOpen}
                onClose={() => setIsAddDeveloperOpen(false)}
                onAdd={handleAddDeveloper}
                newDeveloper={newDeveloper}
                onNewDeveloperChange={setNewDeveloper}
            />

            <DeleteConfirmationDialog
                open={deleteConfirmation.isOpen}
                developerName={deleteConfirmation.developerName}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
            />

            <Snackbar
                open={snackbar.isOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        '& .MuiAlert-message': {
                            padding: '4px 0'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};
