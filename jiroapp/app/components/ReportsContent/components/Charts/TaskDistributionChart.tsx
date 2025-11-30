import { Pie } from '@ant-design/charts';
import { TaskDistributionData } from '../../types/reports.types';

interface TaskDistributionChartProps {
    data: TaskDistributionData[];
}

export const TaskDistributionChart = ({ data }: TaskDistributionChartProps) => {
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.4,
        label: {
            type: 'outer',
            formatter: (datum: any) => `${datum.type}: ${datum.value}`,
            style: {
                fontSize: 12,
                fontWeight: 500,
            },
        },
        interactions: [{ type: 'element-active' }],
        color: ({ type }: { type: string }) => {
            const item = data.find(d => d.type === type);
            return item?.color || '#d1d5db';
        },
        statistic: {
            title: {
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1e293b',
                },
            },
            content: {
                style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#1e293b',
                },
            },
        },
        animation: {
            appear: {
                animation: 'wave-in',
                duration: 1000,
            },
        },
        tooltip: {
            items: [
                { field: 'value', name: 'Количество' },
            ],
        },
    };

    return <Pie {...config} />;
};