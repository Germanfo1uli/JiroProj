import { useState, useEffect } from 'react';
import { ProjectSettings } from '../types/settings';
import { api } from '@/app/auth/hooks/useTokenRefresh';

export const useSettingsForm = (projectId: string, handleProjectUpdated: () => void) => {
    const [settings, setSettings] = useState<ProjectSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/projects/${projectId}`);
                const projectData = response.data;
                setSettings({
                    projectName: projectData.name,
                    description: projectData.description
                });
            } catch (err) {
                setError('Не удалось загрузить настройки проекта');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleSubmit = async (values: ProjectSettings) => {
        try {
            await api.patch(`/projects/${projectId}`, {
                name: values.projectName,
                description: values.description
            });
            setSettings(values);
            console.log('Settings saved:', values);
        } catch (err) {
            console.error('Ошибка при сохранении настроек:', err);
            throw err;
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`https://taskflow.ru/invite/${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`);
        alert('Ссылка скопирована в буфер обмена!');
    };

    const refreshInviteLink = () => {
        if (confirm('Вы уверены, что хотите обновить пригласительную ссылку? Старая ссылка станет недействительной.')) {
            const newLink = `https://taskflow.ru/invite/${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
            console.log('Invite link refreshed:', newLink);
            alert('Пригласительная ссылка успешно обновлена!');
        }
    };

    return {
        settings,
        loading,
        error,
        handleSubmit,
        copyInviteLink,
        refreshInviteLink
    };
};