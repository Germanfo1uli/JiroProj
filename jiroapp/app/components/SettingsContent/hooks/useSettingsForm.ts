import { useState, useEffect } from 'react';
import { ProjectSettings } from '../types/settings';
import { api } from '@/app/auth/hooks/useTokenRefresh';
import { useInviteLink } from './useInviteLink';

export const useSettingsForm = (projectId: string, handleProjectUpdated: () => void) => {
    const [settings, setSettings] = useState<ProjectSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        inviteLink,
        loading: inviteLoading,
        error: inviteError,
        getInviteLink,
        regenerateInviteLink
    } = useInviteLink({ projectId });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const [projectResponse] = await Promise.all([
                    api.get(`/projects/${projectId}`),
                    getInviteLink()
                ]);

                const projectData = projectResponse.data;
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
    }, [projectId, getInviteLink]);

    const handleSubmit = async (values: ProjectSettings) => {
        try {
            await api.patch(`/projects/${projectId}`, {
                name: values.projectName,
                description: values.description
            });
            setSettings(values);
            handleProjectUpdated();
        } catch (err) {
            throw err;
        }
    };

    const copyInviteLink = async () => {
        if (!inviteLink) {
            const link = await getInviteLink();
            if (!link) throw new Error('Не удалось получить ссылку');
            await navigator.clipboard.writeText(link);
        } else {
            await navigator.clipboard.writeText(inviteLink);
        }
    };

    const refreshInviteLink = async () => {
        await regenerateInviteLink();
    };

    return {
        settings,
        loading,
        error,
        inviteLink,
        inviteLoading,
        inviteError,
        handleSubmit,
        copyInviteLink,
        refreshInviteLink
    };
};