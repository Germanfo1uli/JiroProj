import { FaTasks, FaProjectDiagram, FaCalendarAlt, FaStar } from 'react-icons/fa';
import styles from './ProfileStats.module.css';

interface ProfileStatsProps {
    completedTasks: number;
    activeProjects: number;
    joinDate: string;
    position: string;
}

export const ProfileStats = ({ completedTasks, activeProjects, joinDate, position }: ProfileStatsProps) => {
    const formatJoinDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.profileStats}>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <div className={styles.statIconWrapper}>
                        <FaTasks className={styles.statIcon} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{completedTasks}</h3>
                        <p>Завершено задач</p>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIconWrapper}>
                        <FaProjectDiagram className={styles.statIcon} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{activeProjects}</h3>
                        <p>Активных проектов</p>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIconWrapper}>
                        <FaCalendarAlt className={styles.statIcon} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{formatJoinDate(joinDate)}</h3>
                        <p>В команде с</p>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIconWrapper}>
                        <FaStar className={styles.statIcon} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{position}</h3>
                        <p>Должность</p>
                    </div>
                </div>
            </div>
        </div>
    );
};