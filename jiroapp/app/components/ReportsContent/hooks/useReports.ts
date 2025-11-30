import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '../../DashboardContent/hooks/useDashboard';
import { ProjectStats, DeveloperStats, TaskProgressData, EfficiencyData, TaskDistributionData } from '../types/reports.types';
import {
    calculateTaskStats,
    generateProgressData,
    generateDeveloperStats,
    generateEfficiencyData,
    generateTaskDistributionData
} from '../utils/reports.utils';

export const useReports = () => {
    const { boards } = useDashboard();
    const [stats, setStats] = useState<ProjectStats>({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
        averageCompletionTime: 0
    });
    const [developerStats, setDeveloperStats] = useState<DeveloperStats[]>([]);
    const [progressData, setProgressData] = useState<TaskProgressData[]>([]);
    const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>([]);
    const [taskDistributionData, setTaskDistributionData] = useState<TaskDistributionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState<any>(null);

    const calculateAllStats = useCallback(() => {
        if (!boards || !Array.isArray(boards) || boards.length === 0) {
            const demoStats = {
                totalTasks: 15,
                completedTasks: 8,
                inProgressTasks: 4,
                pendingTasks: 3,
                overdueTasks: 2,
                completionRate: 53.3,
                averageCompletionTime: 2.5
            };

            const demoDevStats = [
                { name: 'Иван Иванов', completedTasks: 3, overdueTasks: 0, efficiency: 85, totalTasks: 4 },
                { name: 'Петр Петров', completedTasks: 2, overdueTasks: 1, efficiency: 72, totalTasks: 3 },
                { name: 'Анна Сидорова', completedTasks: 2, overdueTasks: 0, efficiency: 94, totalTasks: 2 },
                { name: 'Мария Козлова', completedTasks: 1, overdueTasks: 1, efficiency: 65, totalTasks: 2 }
            ];

            const demoProgressData = [
                { date: 'День 1', tasks: 2, cumulative: 2 },
                { date: 'День 2', tasks: 3, cumulative: 5 },
                { date: 'День 3', tasks: 1, cumulative: 6 },
                { date: 'День 4', tasks: 4, cumulative: 10 },
                { date: 'День 5', tasks: 2, cumulative: 12 },
                { date: 'День 6', tasks: 3, cumulative: 15 },
                { date: 'День 7', tasks: 1, cumulative: 16 }
            ];

            const demoEfficiencyData = demoDevStats.map(dev => ({
                developer: dev.name,
                efficiency: dev.efficiency,
                completed: dev.completedTasks,
                total: dev.totalTasks
            }));

            const demoDistributionData = [
                { type: 'Выполнено', value: demoStats.completedTasks, color: '#10b981' },
                { type: 'В процессе', value: demoStats.inProgressTasks, color: '#3b82f6' },
                { type: 'Ожидают', value: demoStats.pendingTasks, color: '#f59e0b' },
                { type: 'Просрочено', value: demoStats.overdueTasks, color: '#ef4444' }
            ];

            setStats(demoStats);
            setDeveloperStats(demoDevStats);
            setProgressData(demoProgressData);
            setEfficiencyData(demoEfficiencyData);
            setTaskDistributionData(demoDistributionData);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const calculatedStats = calculateTaskStats(boards);
            const devStats = generateDeveloperStats(boards);
            const progress = generateProgressData(boards);
            const efficiency = generateEfficiencyData(devStats);
            const distribution = generateTaskDistributionData(calculatedStats);

            if (calculatedStats && typeof calculatedStats.totalTasks === 'number') {
                setStats(calculatedStats);
            } else {
                setStats({
                    totalTasks: 0,
                    completedTasks: 0,
                    inProgressTasks: 0,
                    pendingTasks: 0,
                    overdueTasks: 0,
                    completionRate: 0,
                    averageCompletionTime: 0
                });
            }

            setDeveloperStats(Array.isArray(devStats) ? devStats : []);
            setProgressData(Array.isArray(progress) && progress.length > 0 ? progress : []);
            setEfficiencyData(Array.isArray(efficiency) ? efficiency : []);
            setTaskDistributionData(Array.isArray(distribution) && distribution.length > 0 ? distribution : []);

        } catch (error) {
            setStats({
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                completionRate: 0,
                averageCompletionTime: 0
            });
            setDeveloperStats([]);
            setProgressData([]);
            setEfficiencyData([]);
            setTaskDistributionData([]);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [boards]);

    const handleDateRangeChange = useCallback((range: any) => {
        setDateRange(range);
        if (range && range[0] && range[1]) {
        }
    }, []);

    const refreshData = useCallback(() => {
        calculateAllStats();
    }, [calculateAllStats]);

    useEffect(() => {
        calculateAllStats();
    }, [calculateAllStats]);

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
    };
};