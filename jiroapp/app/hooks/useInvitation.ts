import { useState, useCallback } from 'react'
import { api } from '../auth/hooks/useTokenRefresh'

interface InvitationCheckResponse {
    projectId: number
    name: string
    description: string
    creatorName: string
    creatorId: number
    memberCount: number
    isMember: boolean
}

export const useInvitation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const checkInvitation = useCallback(async (token: string): Promise<InvitationCheckResponse | null> => {
        setIsLoading(true)
        setError('')

        try {
            const response = await api.get(`/projects/invitation/${token}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            if (response.status === 200) {
                return response.data
            }
        } catch (error: any) {
            console.error('Error checking invitation:', error)

            if (error.response?.status === 400) {
                setError(error.response.data?.message || 'Неверная ссылка приглашения')
            } else if (error.response?.status === 404) {
                setError('Приглашение не найдено')
            } else {
                setError('Ошибка при проверке приглашения')
            }
        } finally {
            setIsLoading(false)
        }

        return null
    }, [])

    const acceptInvitation = useCallback(async (token: string): Promise<boolean> => {
        setIsLoading(true)

        try {
            const response = await api.post(`/projects/join/${token}`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            return response.status === 200 || response.status === 201
        } catch (error: any) {
            console.error('Error accepting invitation:', error)

            if (error.response?.status === 400) {
                setError(error.response.data?.message || 'Невозможно принять приглашение')
            } else {
                setError('Ошибка при принятии приглашения')
            }

            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const declineInvitation = useCallback(async (token: string): Promise<boolean> => {
        setIsLoading(true)

        try {
            const response = await api.post(`/projects/invitation/${token}/decline`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            return response.status === 200
        } catch (error: any) {
            console.error('Error declining invitation:', error)

            if (error.response?.status === 400) {
                setError(error.response.data?.message || 'Невозможно отклонить приглашение')
            } else {
                setError('Ошибка при отклонении приглашения')
            }

            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        checkInvitation,
        acceptInvitation,
        declineInvitation,
        isLoading,
        error,
        clearError: () => setError('')
    }
}
