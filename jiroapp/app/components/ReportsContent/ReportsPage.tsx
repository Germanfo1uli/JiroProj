'use client'

import { memo } from 'react';
import { Alert, Row, Col, Card, Spin, Empty } from 'antd';
import { useReports } from './hooks/useReports';
import { ReportsHeader } from './components/ReportsHeader/ReportsHeader';
import { StatsCards } from './components/StatsCards/StatsCards';
import { DevelopersStats } from './components/DevelopersStats/DevelopersStats';
import {
    TaskDistributionChart,
    ProgressChart,
    EfficiencyChart,
    ProgressGauge
} from './components/Charts';
import styles from './ReportsPage.module.css';


const MemoizedStatsCards = memo(StatsCards);

const MemoizedDevelopersStats = memo(({ developerStats }: { developerStats: any[] }) =>
    developerStats.length > 0 ?
        <DevelopersStats developerStats={developerStats} /> :
        <Empty description="Нет данных о разработчиках" />
);

const MemoizedTaskDistributionChart = memo(({ data }: { data: any[] }) =>
    data.length > 0 ?
        <TaskDistributionChart data={data} /> :
        <Empty description="Нет данных для графика" />
);

const MemoizedProgressChart = memo(({ data }: { data: any[] }) =>
    data.length > 0 ?
        <ProgressChart data={data} /> :
        <Empty description="Нет данных о прогрессе" />
);

const MemoizedEfficiencyChart = memo(({ data }: { data: any[] }) =>
    data.length > 0 ?
        <EfficiencyChart data={data} /> :
        <Empty description="Нет данных об эффективности" />
);

const MemoizedProgressGauge = memo(({ completionRate }: { completionRate: number }) =>
    <ProgressGauge completionRate={completionRate} />
);

export const ReportsPage = () => {
    const {
        stats,
        developerStats,
        progressData,
        efficiencyData,
        taskDistributionData,
        isLoading,
        dateRange,
        setDateRange,
        refreshData
    } = useReports();

    if (isLoading && !stats.totalTasks) {
        return (
            <div className={styles.reportsSection}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Spin size="large" tip="Загрузка отчетов..." />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.reportsSection}>
            <ReportsHeader
                isLoading={isLoading}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onRefresh={refreshData}
            />

            {stats.overdueTasks > 0 && (
                <Alert
                    message={`Внимание! У вас есть ${stats.overdueTasks} просроченных задач`}
                    type="warning"
                    showIcon
                    closable
                    className={styles.alert}
                />
            )}

            <MemoizedStatsCards stats={stats} />

            <Row gutter={[16, 16]} className={styles.chartsRow}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Распределение задач"
                        variant="borderless"
                        className={styles.chartCard}
                        loading={isLoading}
                    >
                        <MemoizedTaskDistributionChart data={taskDistributionData} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title="Прогресс выполнения"
                        variant="borderless"
                        className={styles.chartCard}
                        loading={isLoading}
                    >
                        <MemoizedProgressChart data={progressData} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className={styles.chartsRow}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Эффективность разработчиков"
                        variant="borderless"
                        className={styles.chartCard}
                        loading={isLoading}
                    >
                        <MemoizedEfficiencyChart data={efficiencyData} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title="Общий прогресс проекта"
                        variant="borderless"
                        className={styles.chartCard}
                        loading={isLoading}
                    >
                        <MemoizedProgressGauge completionRate={stats.completionRate} />
                    </Card>
                </Col>
            </Row>

            <MemoizedDevelopersStats developerStats={developerStats} />
        </div>
    );
};