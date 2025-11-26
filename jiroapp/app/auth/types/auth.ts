export interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    userId: number;
    username: string;
    tag: string;
    email: string;
    pair: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface User {
    userId: number;
    username: string;
    tag: string;
    email: string;
}