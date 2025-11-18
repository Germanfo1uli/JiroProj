export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string;
    position: string;
    joinDate: string;
    completedTasks: number;
    activeProjects: number;
}

export interface ProfileFormData {
    name: string;
    email: string;
    bio: string;
    position: string;
}