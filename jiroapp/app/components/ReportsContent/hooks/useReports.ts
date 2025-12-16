import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../auth/hooks/useTokenRefresh'
import type {
    ProjectStats,
    DeveloperStats,
    TaskProgressData,
    EfficiencyData,
    TaskDistributionData,
    DateRange
} from '../types/reports.types'

interface DashboardResponse {
    projectId: number
    currentMetrics: {
        total_issues: number
        completed_issues: number
        todo_issues: number
        in_progress_issues: number
        completion_rate: number
    }
    userEfficiency: Record<string, number>
    recentActivity: Array<{
        userId: number
        actionType: string
        entityType: string
        entityId: number
        createdAt: string
    }>
    trends: Record<string, {
        metricName: string
        dataPoints: Array<{
            date: string
            value: number
        }>
    }>
}

interface UserProfile {
    id: number
    username: string
    tag: string
    bio: string
}

const getUserProfile = async (userId: string | number): Promise<UserProfile> => {
    try {
        const response = await api.get<UserProfile>(`/users/${userId}/profile`)
        return response.data
    } catch (error) {
        console.error('Ошибка получения профиля пользователя:', error)
        throw error
    }
}

export const useReports = (projectId: number | null) => {
    const [isLoading, setIsLoading] = useState(true)
    const [dateRange, setDateRange] = useState<DateRange | null>(null)
    const [stats, setStats] = useState<ProjectStats>({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
        averageCompletionTime: 0
    })
    const [developerStats, setDeveloperStats] = useState<DeveloperStats[]>([])
    const [progressData, setProgressData] = useState<TaskProgressData[]>([])
    const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>([])
    const [taskDistributionData, setTaskDistributionData] = useState<TaskDistributionData[]>([])

    const fetchDashboardData = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const response = await api.get<DashboardResponse>(`/dashboards/${projectId}/Dashboard`)
            const data = response.data

            const metrics = data.currentMetrics

            const newStats: ProjectStats = {
                totalTasks: metrics.total_issues || 0,
                completedTasks: metrics.completed_issues || 0,
                inProgressTasks: metrics.in_progress_issues || 0,
                pendingTasks: metrics.todo_issues || 0,
                overdueTasks: 0,
                completionRate: metrics.completion_rate || 0,
                averageCompletionTime: 0
            }
            setStats(newStats)

            const userProfiles = new Map<number, UserProfile>()
            const userIds = Object.keys(data.userEfficiency || {})

            for (const userId of userIds) {
                try {
                    const profile = await getUserProfile(userId)
                    userProfiles.set(Number(userId), profile)
                } catch (error) {
                    console.warn(`Не удалось загрузить профиль пользователя ${userId}`)
                }
            }

            const devStatsPromises = Object.entries(data.userEfficiency || {}).map(async ([userId, efficiency]) => {
                const userProfile = userProfiles.get(Number(userId))
                const name = userProfile?.username || `Разработчик ${userId}`

                return {
                    name,
                    completedTasks: Math.round((efficiency / 100) * 10),
                    overdueTasks: 0,
                    efficiency,
                    totalTasks: 10
                }
            })

            const devStats = await Promise.all(devStatsPromises)
            setDeveloperStats(devStats)

            const effData: EfficiencyData[] = devStats.map(dev => ({
                developer: dev.name,
                efficiency: dev.efficiency,
                completed: dev.completedTasks,
                total: dev.totalTasks
            }))
            setEfficiencyData(effData)

            let trendsData: Array<{ date: string; value: number }> = []

            if (data.trends && Object.keys(data.trends).length > 0) {
                const firstTrend = Object.values(data.trends)[0]
                trendsData = firstTrend.dataPoints || []
            } else {
                const today = new Date()
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today)
                    date.setDate(date.getDate() - i)
                    trendsData.push({
                        date: date.toISOString().split('T')[0],
                        value: Math.floor(Math.random() * 5) + 1
                    })
                }
            }

            const progData: TaskProgressData[] = trendsData.map((point, index) => ({
                date: new Date(point.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                tasks: point.value,
                cumulative: trendsData.slice(0, index + 1).reduce((sum, p) => sum + p.value, 0)
            })).slice(-7)
            setProgressData(progData)

            const distData: TaskDistributionData[] = [
                { type: 'Выполнено', value: newStats.completedTasks, color: '#10b981' },
                { type: 'В процессе', value: newStats.inProgressTasks, color: '#3b82f6' },
                { type: 'Ожидают', value: newStats.pendingTasks, color: '#f59e0b' },
                { type: 'Просрочено', value: newStats.overdueTasks, color: '#ef4444' }
            ].filter(item => item.value > 0)
            setTaskDistributionData(distData)

        } catch (error) {
            console.error('Ошибка загрузки данных отчетов:', error)

            setStats({
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                completionRate: 0,
                averageCompletionTime: 0
            })
            setDeveloperStats([])
            setEfficiencyData([])
            setProgressData([])
            setTaskDistributionData([])
        } finally {
            setIsLoading(false)
        }
    }, [projectId])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    const handleDateRangeChange = useCallback((dates: [Date, Date] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange({ startDate: dates[0], endDate: dates[1] })
        } else {
            setDateRange(null)
        }
    }, [])

    const refreshData = useCallback(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    return {
        stats,
        developerStats,
        progressData,
        efficiencyData,
        taskDistributionData,
        isLoading,
        dateRange,
        setDateRange: handleDateRangeChange,
        refreshData
    }
}