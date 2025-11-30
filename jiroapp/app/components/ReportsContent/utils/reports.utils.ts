import { ProjectStats, DeveloperStats, TaskProgressData, EfficiencyData, TaskDistributionData } from '../types/reports.types';
import { Board, Card } from '../../DashboardContent/types/dashboard.types';

export const calculateTaskStats = (boards: Board[]): ProjectStats => {
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;
    const today = new Date();

    if (!Array.isArray(boards)) {
        return getDefaultStats();
    }

    boards.forEach(board => {
        if (!board || !Array.isArray(board.cards)) {
            return;
        }

        board.cards?.forEach(card => {
            if (!card) return;

            totalTasks++;

            const boardTitle = board.title?.toLowerCase() || '';

            if (boardTitle.includes('done') || boardTitle.includes('готово') || boardTitle.includes('выполнено')) {
                completedTasks++;
            } else if (boardTitle.includes('progress') || boardTitle.includes('в процессе') || boardTitle.includes('в работе')) {
                inProgressTasks++;
            } else if (boardTitle.includes('todo') || boardTitle.includes('ожидание') || boardTitle.includes('к выполнению')) {
                pendingTasks++;
            }

            if (card.dueDate) {
                try {
                    const dueDate = new Date(card.dueDate);
                    if (dueDate < today && !(boardTitle.includes('done') || boardTitle.includes('готово') || boardTitle.includes('выполнено'))) {
                        overdueTasks++;
                    }
                } catch (error) {
                }
            }
        });
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const stats = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        averageCompletionTime: calculateAverageCompletionTime(boards)
    };

    return stats;
};

const calculateAverageCompletionTime = (boards: Board[]): number => {
    let totalTime = 0;
    let completedCount = 0;

    boards.forEach(board => {
        const boardTitle = board.title?.toLowerCase() || '';
        if (boardTitle.includes('done') || boardTitle.includes('готово') || boardTitle.includes('выполнено')) {
            board.cards?.forEach(card => {
                if (card && card.createdAt && card.updatedAt) {
                    try {
                        const created = new Date(card.createdAt);
                        const updated = new Date(card.updatedAt);
                        const diffTime = Math.abs(updated.getTime() - created.getTime());
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        totalTime += diffDays;
                        completedCount++;
                    } catch (error) {
                    }
                }
            });
        }
    });

    return completedCount > 0 ? Math.round((totalTime / completedCount) * 10) / 10 : 0;
};

export const generateDeveloperStats = (boards: Board[]): DeveloperStats[] => {
    const developerMap = new Map<string, { completed: number; total: number; overdue: number }>();
    const today = new Date();

    if (!Array.isArray(boards)) {
        return getDemoDeveloperStats();
    }

    boards.forEach(board => {
        if (!board || !Array.isArray(board.cards)) return;

        board.cards?.forEach(card => {
            if (!card) return;

            const devName = card.assignee || `Разработчик ${Math.floor(Math.random() * 1000)}`;
            const current = developerMap.get(devName) || { completed: 0, total: 0, overdue: 0 };

            current.total++;

            const boardTitle = board.title?.toLowerCase() || '';
            if (boardTitle.includes('done') || boardTitle.includes('готово') || boardTitle.includes('выполнено')) {
                current.completed++;
            }

            if (card.dueDate) {
                try {
                    const dueDate = new Date(card.dueDate);
                    if (dueDate < today && !(boardTitle.includes('done') || boardTitle.includes('готово') || boardTitle.includes('выполнено'))) {
                        current.overdue++;
                    }
                } catch (error) {
                }
            }

            developerMap.set(devName, current);
        });
    });

    if (developerMap.size === 0) {
        return getDemoDeveloperStats();
    }

    const devStats = Array.from(developerMap.entries()).map(([name, stats]) => {
        const efficiency = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        return {
            name,
            completedTasks: stats.completed,
            overdueTasks: stats.overdue,
            efficiency,
            totalTasks: stats.total
        };
    });

    return devStats;
};

export const generateProgressData = (boards: Board[]): TaskProgressData[] => {
    const progressMap = new Map<string, number>();

    if (!Array.isArray(boards)) {
        return getDemoProgressData();
    }

    boards.forEach(board => {
        if (!board || !Array.isArray(board.cards)) return;

        board.cards?.forEach(card => {
            if (!card || !card.createdAt) return;

            try {
                const dateObj = new Date(card.createdAt);
                if (isNaN(dateObj.getTime())) {
                    return;
                }

                const date = dateObj.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit'
                });
                progressMap.set(date, (progressMap.get(date) || 0) + 1);
            } catch (error) {
            }
        });
    });

    if (progressMap.size === 0) {
        return getDemoProgressData();
    }

    const sortedEntries = Array.from(progressMap.entries())
        .sort(([a], [b]) => {
            try {
                const dateA = new Date(a.split('.').reverse().join('-'));
                const dateB = new Date(b.split('.').reverse().join('-'));
                return dateA.getTime() - dateB.getTime();
            } catch (error) {
                return 0;
            }
        })
        .slice(-7);

    let cumulative = 0;
    const progressData = sortedEntries.map(([date, tasks], index) => {
        cumulative += tasks;
        return {
            date: date,
            tasks: tasks,
            cumulative: cumulative
        };
    });

    return progressData;
};

export const generateEfficiencyData = (developerStats: DeveloperStats[]): EfficiencyData[] => {
    if (!Array.isArray(developerStats)) {
        return [];
    }

    const efficiencyData = developerStats.map(dev => ({
        developer: dev.name || 'Неизвестный разработчик',
        efficiency: typeof dev.efficiency === 'number' && !isNaN(dev.efficiency) ? dev.efficiency : 0,
        completed: dev.completedTasks || 0,
        total: dev.totalTasks || 0
    }));

    return efficiencyData;
};

export const generateTaskDistributionData = (stats: ProjectStats): TaskDistributionData[] => {
    if (!stats || typeof stats.totalTasks !== 'number') {
        return getDemoDistributionData();
    }

    const distributionData = [
        { type: 'Выполнено', value: stats.completedTasks || 0, color: '#10b981' },
        { type: 'В процессе', value: stats.inProgressTasks || 0, color: '#3b82f6' },
        { type: 'Ожидают', value: stats.pendingTasks || 0, color: '#f59e0b' },
        { type: 'Просрочено', value: stats.overdueTasks || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);

    return distributionData.length > 0 ? distributionData : getDemoDistributionData();
};

const getDefaultStats = (): ProjectStats => ({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0
});

const getDemoDeveloperStats = (): DeveloperStats[] => [
    { name: 'Иван Иванов', completedTasks: 8, overdueTasks: 1, efficiency: 85, totalTasks: 10 },
    { name: 'Петр Петров', completedTasks: 6, overdueTasks: 2, efficiency: 72, totalTasks: 9 },
    { name: 'Анна Сидорова', completedTasks: 10, overdueTasks: 0, efficiency: 94, totalTasks: 10 },
    { name: 'Мария Козлова', completedTasks: 5, overdueTasks: 3, efficiency: 65, totalTasks: 8 }
];

const getDemoProgressData = (): TaskProgressData[] => [
    { date: '01.12', tasks: 2, cumulative: 2 },
    { date: '02.12', tasks: 3, cumulative: 5 },
    { date: '03.12', tasks: 1, cumulative: 6 },
    { date: '04.12', tasks: 4, cumulative: 10 },
    { date: '05.12', tasks: 2, cumulative: 12 },
    { date: '06.12', tasks: 3, cumulative: 15 },
    { date: '07.12', tasks: 1, cumulative: 16 }
];

const getDemoDistributionData = (): TaskDistributionData[] => [
    { type: 'Выполнено', value: 8, color: '#10b981' },
    { type: 'В процессе', value: 4, color: '#3b82f6' },
    { type: 'Ожидают', value: 3, color: '#f59e0b' },
    { type: 'Просрочено', value: 2, color: '#ef4444' }
];