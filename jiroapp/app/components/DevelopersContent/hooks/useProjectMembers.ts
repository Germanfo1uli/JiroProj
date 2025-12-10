import { useState, useEffect, useCallback } from 'react';
import { api } from '@/app/auth/hooks/useTokenRefresh';
import { ProjectMember } from '../types/developer.types';

export const useProjectMembers = (projectId: string | null) => {
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async () => {
        if (!projectId) {
            setMembers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/projects/${projectId}/members`);
            const data = response.data;

            if (Array.isArray(data)) {
                setMembers(data);
            } else if (data && typeof data === 'object') {
                setMembers([data]);
            } else {
                setMembers([]);
            }
        } catch (err: any) {
            setError('Не удалось загрузить участников проекта');
            setMembers([]);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchMembers();
    }, [projectId, fetchMembers]);

    return {
        members,
        loading,
        error,
        refetch: fetchMembers
    };
};