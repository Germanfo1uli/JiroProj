export interface ProjectSettings {
    avatar: string;
    projectName: string;
    description: string;
    inviteLink: string;
}

export interface SettingsFormProps {
    initialData: ProjectSettings;
    onSubmit: (values: ProjectSettings) => void;
}