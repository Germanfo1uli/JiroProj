import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

type TokenUpdater = (accessToken: string, refreshToken: string) => void;
type LogoutHandler = () => void;

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

const getTokenExpiryTime = (token: string): number | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000;
    } catch (e) {
        console.error('Ошибка парсинга токена:', e);
        return null;
    }
};

const shouldRefreshToken = (token: string): boolean => {
    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) return true;

    const timeLeft = expiryTime - Date.now();
    const oneMinute = 60 * 1000;

    return timeLeft <= oneMinute;
};

const isTokenExpired = (token: string): boolean => {
    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) return true;

    return Date.now() >= expiryTime;
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('Refresh token не найден');
                }

                const response = await api.post('/auth/refresh', { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (accessToken && newRefreshToken) {
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    processQueue(null, accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('Неверный ответ от сервера');
                }
            } catch (refreshError) {
                console.error('Ошибка обновления токена:', refreshError);
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const useTokenRefresh = (
    updateTokens: TokenUpdater,
    handleLogout: LogoutHandler
) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const refreshTokens = useCallback(async (): Promise<boolean> => {
        const currentRefreshToken = localStorage.getItem('refreshToken');
        const currentAccessToken = localStorage.getItem('token');

        if (!currentRefreshToken || !currentAccessToken) {
            console.warn('Токены не найдены');
            return false;
        }

        if (!isTokenExpired(currentAccessToken) && !shouldRefreshToken(currentAccessToken)) {
            const expiryTime = getTokenExpiryTime(currentAccessToken)!;
            const minutesLeft = Math.round((expiryTime - Date.now()) / (60 * 1000));
            console.log(`Токен валиден еще ${minutesLeft} минут`);
            return true;
        }

        try {
            console.log('Обновление токенов...');
            const response = await api.post('/auth/refresh', {
                refreshToken: currentRefreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            if (accessToken && newRefreshToken) {
                updateTokens(accessToken, newRefreshToken);
                console.log('Токены успешно обновлены');
                return true;
            } else {
                throw new Error('Неверный ответ сервера');
            }
        } catch (error) {
            console.error('Ошибка обновления токенов:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            handleLogout();
            return false;
        }
    }, [updateTokens, handleLogout]);

    useEffect(() => {
        refreshTokens();

        const fifteenMinutes = 15 * 60 * 1000;

        intervalRef.current = setInterval(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Токен не найден, пропуск проверки');
                return;
            }

            if (shouldRefreshToken(token) || isTokenExpired(token)) {
                console.log('Токен нужно обновить, запуск...');
                refreshTokens();
            }
        }, fifteenMinutes);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                console.log('Интервал обновления токенов очищен');
            }
        };
    }, [refreshTokens]);

    return {
        refreshToken: refreshTokens,
        api
    };
};

export { api };