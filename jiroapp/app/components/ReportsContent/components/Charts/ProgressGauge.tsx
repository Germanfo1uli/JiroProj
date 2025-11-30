import { Gauge, GaugeConfig } from '@ant-design/charts';

interface ProgressGaugeProps {
    completionRate: number;
}

export const ProgressGauge = ({ completionRate }: ProgressGaugeProps) => {
    const validRate = isNaN(completionRate) ? 0 : Math.max(0, Math.min(100, completionRate));

    const config: GaugeConfig = {
        percent: validRate / 100,
        range: {
            color: validRate >= 70 ? '#10b981' : validRate >= 40 ? '#f59e0b' : '#ef4444',
            width: 20,
        },
        indicator: {
            pointer: {
                style: {
                    stroke: validRate >= 70 ? '#10b981' : validRate >= 40 ? '#f59e0b' : '#ef4444',
                    lineWidth: 3,
                },
            },
            pin: {
                style: {
                    stroke: validRate >= 70 ? '#10b981' : validRate >= 40 ? '#f59e0b' : '#ef4444',
                    lineWidth: 3,
                },
            },
        },
        axis: {
            label: {
                formatter: (v: string) => {
                    const value = parseFloat(v) * 100;
                    return `${value % 20 === 0 ? value.toFixed(0) + '%' : ''}`;
                },
            },
            subTickLine: {
                count: 3,
            },
        },
        statistic: {
            title: {
                formatter: () => 'Завершено',
                style: {
                    fontSize: '16px',
                    color: '#64748b',
                    fontWeight: 500,
                },
            },
            content: {
                formatter: () => `${validRate.toFixed(1)}%`,
                style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    color: validRate >= 70 ? '#10b981' : validRate >= 40 ? '#f59e0b' : '#ef4444',
                },
            },
        },
        animation: {
            appear: {
                animation: 'gauge-in',
                duration: 1000,
            },
        },
    };

    return <Gauge {...config} />;
};