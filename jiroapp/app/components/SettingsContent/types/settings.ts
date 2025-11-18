export interface ProjectSettings {
    avatar: string;
    projectName: string;
    capacity: number;
    description: string;
    inviteLink: string;
}

export interface SettingsFormProps {
    initialData: ProjectSettings;
    onSubmit: (values: ProjectSettings) => void;
}