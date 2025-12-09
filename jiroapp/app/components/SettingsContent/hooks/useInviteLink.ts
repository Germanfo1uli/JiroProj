import { useState, useCallback } from 'react';
import { api } from '@/app/auth/hooks/useTokenRefresh';

interface UseInviteLinkProps {
    projectId: string;
}

interface UseInviteLinkReturn {
    inviteLink: string | null;
    loading: boolean;
    error: string | null;
    getInviteLink: () => Promise<string | null>;
    regenerateInviteLink: () => Promise<string | null>;
}

export const useInviteLink = ({ projectId }: UseInviteLinkProps): UseInviteLinkReturn => {
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getInviteLink = useCallback(async (): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/projects/${projectId}/invite`);
            const data = response.data;

            let link: string | null = null;

            if (typeof data === 'string') {
                link = data;
            }
            else if (data && typeof data === 'object') {
                link = data?.inviteLink || data?.link || data?.url || data?.invite_url || data?.inviteUrl;
            }

            if (typeof link === 'string' && link.trim() !== '') {
                setInviteLink(link);
                return link;
            } else {
                console.warn('Получен некорректный формат ссылки:', data);
                throw new Error('Некорректный формат ссылки в ответе');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Не удалось получить пригласительную ссылку';
            setError(errorMessage);
            console.error('Ошибка получения invite link:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const regenerateInviteLink = useCallback(async (): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post(`/projects/${projectId}/invite/regenerate`);
            const data = response.data;

            let link: string | null = null;

            if (typeof data === 'string') {
                link = data;
            }
            else if (data && typeof data === 'object') {
                link = data?.inviteLink || data?.link || data?.url || data?.invite_url || data?.inviteUrl;
            }

            if (typeof link === 'string' && link.trim() !== '') {
                setInviteLink(link);
                return link;
            } else {
                console.warn('Получен некорректный формат ссылки при регенерации:', data);
                throw new Error('Некорректный формат ссылки в ответе');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Не удалось обновить пригласительную ссылку';
            setError(errorMessage);
            console.error('Ошибка обновления invite link:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    return {
        inviteLink,
        loading,
        error,
        getInviteLink,
        regenerateInviteLink
    };
};