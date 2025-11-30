import { useState, useEffect } from 'react';
import { UserProfile, ProfileFormData } from '../types/profile.types';
import { useAuth } from '@/app/auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { api } from '@/app/auth/hooks/useTokenRefresh';

export const useProfile = () => {
    const { getCurrentUser, updateUserData } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        id: '',
        name: '',
        email: '',
        tag: '',
        avatar: null,
        bio: '',
        position: 'Сотрудник',
        joinDate: '',
        completedTasks: 0,
        activeProjects: 0
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initializeProfile = async () => {
            loadUserProfile();
            await loadUserAvatar();
        };
        initializeProfile();
    }, []);

    const loadUserProfile = () => {
        const user = getCurrentUser();
        if (user) {
            setProfile(prev => ({
                ...prev,
                id: user.userId || '',
                name: user.username || '',
                email: user.email || '',
                tag: user.tag || '',
                bio: user.bio || '',
                avatar: user.avatar || null,
                position: user.position || 'Сотрудник',
                joinDate: user.joinDate || new Date().toISOString().split('T')[0]
            }));
        }
    };

    const updateProfile = async (formData: ProfileFormData): Promise<void> => {
        setIsLoading(true);

        try {
            const payload = {
                username: formData.name,
                bio: formData.bio
            };

            let response = await api.patch('/users/me/update', payload);

            if (response.status === 405) {
                response = await api.put('/users/me/update', payload);
            }

            const data = response.data;

            setProfile(prev => ({
                ...prev,
                ...formData,
                name: data.name || data.username || formData.name,
                tag: data.tag || prev.tag,
                bio: data.bio || formData.bio
            }));

            updateUserData({
                username: data.name || data.username || formData.name,
                tag: data.tag,
                bio: data.bio || formData.bio
            });

            toast.success('Профиль успешно обновлен');

        } catch (error: any) {
            if (error.code === 'ERR_NETWORK') {
                toast.error('Сервер недоступен. Изменения сохранены локально');
                setProfile(prev => ({
                    ...prev,
                    ...formData
                }));
                updateUserData({
                    username: formData.name,
                    bio: formData.bio
                });
            } else {
                let errorMessage = 'Ошибка при обновлении профиля';
                if (error.response) {
                    const errorData = error.response.data;
                    if (error.response.status === 400 && errorData.errors) {
                        const validationErrors = Object.values(errorData.errors).join(', ');
                        errorMessage = `Ошибка валидации: ${validationErrors}`;
                    } else {
                        errorMessage = errorData.message || errorData.error || errorMessage;
                    }
                    if (error.response.status === 500) {
                        errorMessage = 'Ошибка сервера при обновлении профиля. Пожалуйста, попробуйте позже.';
                    }
                } else if (error.request) {
                    errorMessage = 'Нет ответа от сервера';
                } else {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
                throw error;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateAvatar = async (avatarFile: File): Promise<void> => {
        setIsLoading(true);

        const localAvatarUrl = URL.createObjectURL(avatarFile);

        setProfile(prev => ({
            ...prev,
            avatar: localAvatarUrl
        }));

        updateUserData({
            avatar: localAvatarUrl
        });

        try {
            const formData = new FormData();
            formData.append('file', avatarFile);

            await api.post('/users/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Аватар успешно обновлен');

        } catch (error: any) {
            let errorMessage = 'Ошибка при синхронизации аватара с сервером';
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Сервер недоступен. Аватар сохранен локально.';
            }
            toast.warning(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAvatar = async (): Promise<void> => {
        setIsLoading(true);

        setProfile(prev => ({
            ...prev,
            avatar: null
        }));

        updateUserData({
            avatar: null
        });

        try {
            await api.delete('/users/me/avatar');
            toast.success('Аватар успешно удален');
        } catch (error: any) {
            let errorMessage = 'Ошибка при удалении аватара с сервера';
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Сервер недоступен. Аватар удален локально.';
            }
            toast.warning(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserAvatar = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found for avatar request');
                return;
            }

            const avatarUrl = `/users/me/avatar?t=${Date.now()}`;
            const response = await api.get(avatarUrl, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const blob = response.data;
            const avatarObjectUrl = URL.createObjectURL(blob);

            setProfile(prev => ({
                ...prev,
                avatar: avatarObjectUrl
            }));

            updateUserData({
                avatar: avatarObjectUrl
            });
        } catch (error: any) {
            if (error.response?.status !== 404) {
                console.warn('Ошибка при загрузке аватара с сервера:', error.message);
            }
            setProfile(prev => ({ ...prev, avatar: null }));
        }
    };

    return {
        profile,
        isLoading,
        updateProfile,
        updateAvatar,
        deleteAvatar,
        loadUserAvatar
    };
};