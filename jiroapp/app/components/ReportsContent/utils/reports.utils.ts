import type { ProjectStats, DeveloperStats, TaskProgressData, EfficiencyData, TaskDistributionData } from '../types/reports.types'

export const generateEfficiencyData = (developerStats: DeveloperStats[]): EfficiencyData[] => {
    if (!Array.isArray(developerStats) || developerStats.length === 0) return []
    return developerStats
        .filter(dev => dev.totalTasks > 0)
        .map(dev => ({
            developer: dev.name,
            efficiency: dev.efficiency,
            completed: dev.completedTasks,
            total: dev.totalTasks
        }))
}

export const generateTaskDistributionData = (stats: ProjectStats): TaskDistributionData[] => {
    if (!stats || stats.totalTasks === 0) return []

    const distribution = [
        { type: 'Выполнено', value: stats.completedTasks, color: '#10b981' },
        { type: 'В процессе', value: stats.inProgressTasks, color: '#3b82f6' },
        { type: 'Ожидают', value: stats.pendingTasks, color: '#f59e0b' },
        { type: 'Просрочено', value: stats.overdueTasks, color: '#ef4444' }
    ].filter(item => item.value > 0)

    return distribution
}