export interface ProjectSettings {
    projectName: string;
    description: string;
}

export interface SettingsFormProps {
    initialData: ProjectSettings;
    onSubmit: (values: ProjectSettings) => void;
}