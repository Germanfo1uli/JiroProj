import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStats, ProjectActivity } from '../types/types';

export const useProjectData = (projectId?: string) => {
    const [project, setProject] = useState<Project | null>(null);
    const [stats, setStats] = useState<ProjectStats>({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        members: 0,
        overdueTasks: 0
    });
    const [activities, setActivities] = useState<ProjectActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjectData = useCallback(async (projectData: Project) => {
        setIsLoading(true);
        try {
            // Используем данные из проекта
            const projectStats: ProjectStats = {
                totalTasks: projectData.tasks || 0,
                completedTasks: Math.floor((projectData.tasks || 0) * (projectData.progress || 0) / 100),
                pendingTasks: Math.floor((projectData.tasks || 0) * (100 - (projectData.progress || 0)) / 100),
                members: projectData.members || 1,
                overdueTasks: Math.floor((projectData.tasks || 0) * 0.1) // 10% просроченных
            };

            const mockActivities: ProjectActivity[] = [
                {
                    id: '1',
                    type: 'task_created',
                    user: { name: projectData.owner?.name || 'Вы' },
                    description: `Создан проект "${projectData.name}"`,
                    timestamp: 'Только что'
                }
            ];

            // Если есть дополнительные данные, можно добавить больше активности
            if (projectData.tasks && projectData.tasks > 0) {
                mockActivities.push({
                    id: '2',
                    type: 'task_created',
                    user: { name: projectData.owner?.name || 'Вы' },
                    description: 'Добавлены первые задачи',
                    timestamp: 'Только что'
                });
            }

            setProject(projectData);
            setStats(projectStats);
            setActivities(mockActivities);
        } catch (error) {
            console.error('Ошибка загрузки проекта:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshProject = useCallback(async () => {
        if (project) {
            await fetchProjectData(project);
        }
    }, [project, fetchProjectData]);

    useEffect(() => {
        if (projectId) {
            // Если передали только ID, загружаем данные с сервера
            const fetchFromServer = async () => {
                try {
                    // Здесь будет реальный API запрос
                    // Временно создаем mock проект
                    const mockProject: Project = {
                        id: projectId,
                        name: 'Мой проект',
                        description: 'Описание проекта для демонстрации возможностей TaskFlow',
                        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                        createdAt: new Date(),
                        members: 3,
                        tasks: 12,
                        progress: 65,
                        tags: ['Дизайн', 'Разработка', 'Планирование'],
                        owner: {
                            id: '1',
                            name: 'Иван Иванов',
                            avatar: 'https://ui-avatars.com/api/?name=Иван+Иванов'
                        }
                    };
                    await fetchProjectData(mockProject);
                } catch (error) {
                    console.error('Ошибка загрузки с сервера:', error);
                }
            };
            fetchFromServer();
        }
    }, [projectId, fetchProjectData]);

    return {
        project,
        stats,
        activities,
        isLoading,
        setProject: fetchProjectData, // Изменяем setProject чтобы он принимал проект
        refreshProject
    };
};