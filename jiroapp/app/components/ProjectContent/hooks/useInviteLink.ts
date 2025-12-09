import { useState, useCallback } from 'react';
import { api } from '@/app/auth/hooks/useTokenRefresh';

interface UseInviteLinkReturn {
    inviteLink: string | null;
    loading: boolean;
    error: string | null;
    fetchInviteLink: () => Promise<void>;
    regenerateInviteLink: () => Promise<void>;
    copyInviteLink: () => Promise<boolean>;
}

export const useInviteLink = (projectId: string): UseInviteLinkReturn => {
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInviteLink = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/projects/${projectId}/invite`);
            setInviteLink(response.data.inviteLink);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Не удалось загрузить пригласительную ссылку';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const regenerateInviteLink = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post(`/api/projects/${projectId}/invite/regenerate`);
            setInviteLink(response.data.inviteLink);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Не удалось обновить пригласительную ссылку';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const copyInviteLink = useCallback(async (): Promise<boolean> => {
        if (!inviteLink) return false;

        try {
            await navigator.clipboard.writeText(inviteLink);
            return true;
        } catch {
            setError('Не удалось скопировать ссылку');
            return false;
        }
    }, [inviteLink]);

    return {
        inviteLink,
        loading,
        error,
        fetchInviteLink,
        regenerateInviteLink,
        copyInviteLink
    };
};