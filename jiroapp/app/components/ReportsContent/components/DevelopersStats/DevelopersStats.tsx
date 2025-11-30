import { Card, Row, Col, Typography } from 'antd';
import { FaCheckCircle, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { DeveloperStats } from '../../types/reports.types';
import styles from './DevelopersStats.module.css';

const { Text } = Typography;

interface DevelopersStatsProps {
    developerStats: DeveloperStats[];
}

export const DevelopersStats = ({ developerStats }: DevelopersStatsProps) => {
    return (
        <Card
            title="Статистика по участникам команды"
            className={styles.developersCard}
        >
            <Row gutter={[16, 16]}>
                {developerStats.map((dev, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            size="small"
                            className={styles.devCard}
                            styles={{
                                body: {
                                    padding: '12px'
                                }
                            }}
                        >
                            <div className={styles.devInfo}>
                                <Text strong className={styles.devName}>
                                    {dev.name}
                                </Text>
                                <div className={styles.devStats}>
                                    <div className={styles.devStat}>
                                        <FaCheckCircle className={styles.devStatIcon} style={{ color: '#10b981' }} />
                                        <Text>{dev.completedTasks} выполнено</Text>
                                    </div>
                                    <div className={styles.devStat}>
                                        <FaExclamationTriangle className={styles.devStatIcon} style={{ color: '#ef4444' }} />
                                        <Text>{dev.overdueTasks} просрочено</Text>
                                    </div>
                                    <div className={styles.devStat}>
                                        <FaChartLine className={styles.devStatIcon} style={{ color: '#8b5cf6' }} />
                                        <Text>Эффективность: {dev.efficiency}%</Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};