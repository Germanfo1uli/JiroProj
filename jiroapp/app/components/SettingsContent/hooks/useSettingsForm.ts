import { useState } from 'react';
import { ProjectSettings } from '../types/settings';

export const useSettingsForm = (initialData: ProjectSettings) => {
    const [settings, setSettings] = useState<ProjectSettings>(initialData);

    const handleSubmit = (values: ProjectSettings) => {
        setSettings(values);
        // Здесь будет API вызов для сохранения настроек
        console.log('Settings saved:', values);
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(settings.inviteLink);
        alert('Ссылка скопирована в буфер обмена!');
    };

    const refreshInviteLink = () => {
        if (confirm('Вы уверены, что хотите обновить пригласительную ссылку? Старая ссылка станет недействительной.')) {
            const newLink = `https://taskflow.ru/invite/${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
            setSettings(prev => ({
                ...prev,
                inviteLink: newLink
            }));
            console.log('Invite link refreshed:', newLink);
            alert('Пригласительная ссылка успешно обновлена!');
        }
    };

    return {
        settings,
        handleSubmit,
        copyInviteLink,
        refreshInviteLink
    };
};