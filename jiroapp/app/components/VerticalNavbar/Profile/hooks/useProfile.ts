import { useState, useEffect } from 'react';
import { UserProfile, ProfileFormData } from '../types/profile.types';
import { useAuth } from '@/app/auth/hooks/useAuth';

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
        loadUserProfile();
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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен авторизации отсутствует');
            }

            console.log('Отправка данных профиля:', {
                username: formData.name,
                bio: formData.bio
            });

            let response = await fetch('http://localhost:8080/api/users/me/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: formData.name,
                    bio: formData.bio
                }),
            });

            console.log('Статус ответа PATCH:', response.status);

            if (!response.ok && response.status === 405) {
                console.log('Пробуем PUT метод вместо PATCH');
                response = await fetch('http://localhost:8080/api/users/me/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        username: formData.name,
                        bio: formData.bio
                    }),
                });
                console.log('Статус ответа PUT:', response.status);
            }

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки от сервера:', errorData);
                    if (response.status === 400 && errorData.errors) {
                        const validationErrors = Object.values(errorData.errors).join(', ');
                        errorMessage = `Ошибка валидации: ${validationErrors}`;
                    } else {
                        errorMessage = errorData.message || errorData.error || errorMessage;
                    }
                    if (response.status === 500) {
                        errorMessage = 'Ошибка сервера при обновлении профиля. Пожалуйста, попробуйте позже.';
                    }
                } catch (parseError) {
                    console.error('Ошибка парсинга ответа:', parseError);
                    const text = await response.text();
                    console.error('Текст ответа:', text);

                    if (response.status === 500) {
                        errorMessage = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
                    }
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Успешный ответ от сервера:', data);
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

        } catch (error) {
            console.error('Полная ошибка при обновлении профиля:', error);

            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                console.warn('Сервер недоступен, обновляем локально');
                setProfile(prev => ({
                    ...prev,
                    ...formData
                }));
                updateUserData({
                    username: formData.name,
                    bio: formData.bio
                });
            } else {
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
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Токен авторизации отсутствует, сохраняем только локально');
                return;
            }

            const formData = new FormData();
            formData.append('file', avatarFile);

            console.log('Отправка файла аватара на сервер:', {
                fileName: avatarFile.name,
                fileSize: avatarFile.size,
                fileType: avatarFile.type
            });

            const response = await fetch('http://localhost:8080/api/users/me/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки от сервера:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Ошибка парсинга ответа:', parseError);
                }

                console.warn('Ошибка при синхронизации аватара с сервером:', errorMessage);
                return;
            }

            const data = await response.json();
            console.log('Успешный ответ от сервера при обновлении аватара:', data);

            if (data.avatarUrl) {
                console.log('Серверный URL аватара:', data.avatarUrl);
            }

        } catch (error) {
            console.error('Ошибка при синхронизации аватара с сервером:', error);
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
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Токен авторизации отсутствует, удаляем только локально');
                return;
            }

            const response = await fetch('http://localhost:8080/api/users/me/avatar', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки от сервера:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Ошибка парсинга ответа:', parseError);
                }

                console.warn('Ошибка при удалении аватара с сервера:', errorMessage);
            } else {
                console.log('Аватар успешно удален с сервера');
            }

        } catch (error) {
            console.error('Ошибка при удалении аватара с сервера:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserAvatar = async (): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const avatarUrl = `http://localhost:8080/api/users/me/avatar?t=${Date.now()}`;

            const response = await fetch(avatarUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const avatarObjectUrl = URL.createObjectURL(blob);

                setProfile(prev => ({
                    ...prev,
                    avatar: avatarObjectUrl
                }));

                updateUserData({
                    avatar: avatarObjectUrl
                });

                console.log('Аватар успешно загружен с сервера');
            } else {
                console.log('Аватар не найден на сервере, используем null');
                setProfile(prev => ({
                    ...prev,
                    avatar: null
                }));
            }
        } catch (error) {
            console.warn('Ошибка при загрузке аватара с сервера:', error);
        }
    };

    useEffect(() => {
        const initializeProfile = async () => {
            loadUserProfile();
            await loadUserAvatar();
        };

        initializeProfile();
    }, []);

    return {
        profile,
        isLoading,
        updateProfile,
        updateAvatar,
        deleteAvatar,
        loadUserAvatar
    };
};