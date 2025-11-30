import { Column } from '@ant-design/charts';
import { EfficiencyData } from '../../types/reports.types';

interface EfficiencyChartProps {
    data: EfficiencyData[];
}

export const EfficiencyChart = ({ data }: EfficiencyChartProps) => {
    const chartData = data && data.length > 0 ? data.map(item => ({
        developer: item.developer || 'Неизвестный',
        efficiency: typeof item.efficiency === 'number' ? item.efficiency : 0,
        completed: item.completed || 0,
        total: item.total || 0
    })) : [
        { developer: 'Нет данных', efficiency: 0, completed: 0, total: 0 }
    ];

    const config = {
        data: chartData,
        padding: [40, 40, 60, 80],
        xField: 'developer',
        yField: 'efficiency',
        color: '#3b82f6',
        label: {
            position: 'top',
            formatter: (datum: any) => `${datum.efficiency}%`,
            style: {
                fill: '#1e293b',
                fontSize: 12,
                fontWeight: 600,
            },
        },
        axis: {
            x: {
                title: {
                    text: 'Разработчик',
                    style: {
                        fontSize: 14,
                        fontWeight: 600,
                    }
                },
                label: {
                    autoRotate: false,
                    autoHide: true,
                    formatter: (text: string) => text.length > 10 ? text.substring(0, 10) + '...' : text
                }
            },
            y: {
                title: {
                    text: 'Эффективность (%)',
                    style: {
                        fontSize: 14,
                        fontWeight: 600,
                    }
                },
                min: 0,
                max: 100,
                tickCount: 6,
            }
        },
        animation: {
            appear: {
                animation: 'scale-in-y',
                duration: 1000,
            },
        },
        tooltip: {
            showTitle: true,
            title: 'Эффективность разработчика',
            items: [
                { field: 'efficiency', name: 'Эффективность', valueFormatter: (val: number) => `${val}%` },
                { field: 'completed', name: 'Выполнено задач' },
                { field: 'total', name: 'Всего задач' },
            ],
        },
        interactions: [
            { type: 'active-region' },
            { type: 'element-highlight' }
        ],
    };

    return <Column {...config} />;
};