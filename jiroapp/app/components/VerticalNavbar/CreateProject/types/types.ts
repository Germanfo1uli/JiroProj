export interface Project {
    id: string;
    name: string;
    description: string;
    image: string | null;
    createdAt: Date;
    members?: number; // Делаем необязательным
    tasks?: number; // Делаем необязательным
    progress?: number; // Делаем необязательным
    tags?: string[]; // Делаем необязательным
    owner?: { // Делаем необязательным
        id: string;
        name: string;
        avatar?: string;
    };
}

// Остальные типы остаются без изменений
export interface CreateProjectFormData {
    name: string;
    description: string;
    image: File | null;
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: (project: Project) => void;
}

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ImageUploadState {
    previewUrl: string | null;
    selectedFile: File | null;
    cropArea: CropArea | null;
    isCropping: boolean;
}