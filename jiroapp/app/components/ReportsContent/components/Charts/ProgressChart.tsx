import { Line } from '@ant-design/charts';
import { TaskProgressData } from '../../types/reports.types';

interface ProgressChartProps {
    data: TaskProgressData[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
    const chartData = data && data.length > 0 ? data : [
        { date: 'День 1', tasks: 0, cumulative: 0 },
        { date: 'День 2', tasks: 0, cumulative: 0 },
        { date: 'День 3', tasks: 0, cumulative: 0 }
    ];

    const config = {
        data: chartData,
        padding: [40, 40, 60, 60],
        xField: 'date',
        yField: 'cumulative',
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: '#8b5cf6',
                stroke: '#fff',
                lineWidth: 2,
            },
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
        interactions: [{ type: 'tooltip' }, { type: 'element-active' }],
        color: '#8b5cf6',
        smooth: true,
        lineStyle: {
            lineWidth: 3,
        },
        tooltip: {
            showMarkers: true,
            formatter: (datum: any) => {
                return { name: 'Накопленные задачи', value: `${datum.cumulative}` };
            },
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
    };

    return <Line {...config} />;
};