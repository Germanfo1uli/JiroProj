import { useState } from 'react';
import { UserProfile, ProfileFormData } from '../types/profile.types';

export const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        name: 'Алексей Петров',
        email: 'alexey.petrov@taskflow.ru',
        avatar: null,
        bio: 'Full-stack разработчик с опытом работы в веб-разработке более 5 лет. Люблю создавать удобные и современные интерфейсы.',
        position: 'Team Lead',
        joinDate: '2024-01-15',
        completedTasks: 24,
        activeProjects: 3
    });

    const [isLoading, setIsLoading] = useState(false);

    const updateProfile = async (formData: ProfileFormData): Promise<void> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProfile(prev => ({
            ...prev,
            ...formData
        }));

        setIsLoading(false);
    };

    const updateAvatar = async (avatarFile: File): Promise<void> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const avatarUrl = URL.createObjectURL(avatarFile);
        setProfile(prev => ({
            ...prev,
            avatar: avatarUrl
        }));

        setIsLoading(false);
    };

    return {
        profile,
        isLoading,
        updateProfile,
        updateAvatar
    };
};