import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import type { TaskProgressData } from '../../types/reports.types'

interface ProgressChartProps {
    data: TaskProgressData[]
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
    const chartData = data.length > 0 ? data : []

    if (chartData.length === 0) {
        return (
            <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 16 }}>Нет данных для отображения</div>
            </div>
        )
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)' }}
                        formatter={(value: number) => [`Накопленные задачи: ${value}`, '']}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#8b5cf6"
                        strokeWidth={4}
                        dot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#8b5cf6' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}