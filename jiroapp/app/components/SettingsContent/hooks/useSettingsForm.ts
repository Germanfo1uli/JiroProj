import { useState } from 'react';
import { ProjectSettings } from '../types/settings';

export const useSettingsForm = (initialData: ProjectSettings) => {
    const [settings, setSettings] = useState<ProjectSettings>(initialData);

    const handleSubmit = (values: ProjectSettings) => {
        setSettings(values);
        console.log('Settings saved:', values);
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(settings.inviteLink);
        alert('Ссылка скопирована в буфер обмена!');
    };

    return {
        settings,
        handleSubmit,
        copyInviteLink
    };
};