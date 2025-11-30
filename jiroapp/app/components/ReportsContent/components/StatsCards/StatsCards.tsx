import { Card, Row, Col, Statistic } from 'antd';
import {
    FaTasks,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaUserFriends
} from 'react-icons/fa';
import { ProjectStats } from '../../types/reports.types';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
    stats: ProjectStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const statCards = [
        {
            title: 'Всего задач',
            value: stats.totalTasks,
            icon: <FaTasks className={styles.statIcon} />,
            color: '#3b82f6'
        },
        {
            title: 'Выполнено',
            value: stats.completedTasks,
            icon: <FaCheckCircle className={styles.statIcon} />,
            color: '#10b981'
        },
        {
            title: 'В процессе',
            value: stats.inProgressTasks,
            icon: <FaClock className={styles.statIcon} />,
            color: '#f59e0b'
        },
        {
            title: 'Ожидают',
            value: stats.pendingTasks,
            icon: <FaTasks className={styles.statIcon} />,
            color: '#6b7280'
        },
        {
            title: 'Просрочено',
            value: stats.overdueTasks,
            icon: <FaExclamationTriangle className={styles.statIcon} />,
            color: '#ef4444'
        },
        {
            title: 'Эффективность',
            value: stats.completionRate,
            suffix: '%',
            icon: <FaUserFriends className={styles.statIcon} />,
            color: '#8b5cf6'
        }
    ];

    return (
        <Row gutter={[16, 16]} className={styles.statsRow}>
            {statCards.map((stat, index) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={index}>
                    <Card className={styles.statCard}>
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            suffix={stat.suffix}
                            prefix={stat.icon}
                            styles={{
                                content: {
                                    color: stat.color,
                                    fontSize: '24px',
                                    fontWeight: 600
                                },
                                title: {
                                    fontSize: '14px',
                                    color: '#64748b',
                                    fontWeight: 500
                                }
                            }}
                            classNames={{
                                content: styles.statisticContent
                            }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};