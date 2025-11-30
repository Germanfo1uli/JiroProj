import { Typography, Button, Space, DatePicker, Tooltip } from 'antd';
import { FaChartLine, FaSync, FaCalendarAlt } from 'react-icons/fa';
import styles from './ReportsHeader.module.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ReportsHeaderProps {
    isLoading: boolean;
    dateRange: any;
    onDateRangeChange: (range: any) => void;
    onRefresh: () => void;
}

export const ReportsHeader = ({
                                  isLoading,
                                  dateRange,
                                  onDateRangeChange,
                                  onRefresh
                              }: ReportsHeaderProps) => {
    return (
        <div className={styles.reportsHeader}>
            <div className={styles.headerTop}>
                <div className={styles.titleSection}>
                    <div className={styles.titleRow}>
                        <Title level={1} className={styles.pageTitle}>
                            <FaChartLine className={styles.titleIcon} />
                            Отчеты по проекту
                        </Title>
                        <Button
                            onClick={onRefresh}
                            loading={isLoading}
                            icon={<FaSync />}
                            className={styles.refreshButton}
                        >
                            Обновить
                        </Button>
                    </div>
                    <Text className={styles.pageSubtitle}>
                        Аналитика производительности и отслеживание прогресса проекта
                    </Text>
                </div>
            </div>

            <div className={styles.filtersSection}>
                <Space>
                    <Tooltip title="Выберите период для анализа данных">
                        <RangePicker
                            placeholder={['Начальная дата', 'Конечная дата']}
                            suffixIcon={<FaCalendarAlt />}
                            onChange={onDateRangeChange}
                        />
                    </Tooltip>
                </Space>
            </div>
        </div>
    );
};