import styles from '../Dashboard.module.css';

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
    return (
        <div className={styles.boardsHeader}>
            <div className={styles.headerTop}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>{title}</h1>
                    <p className={styles.pageSubtitle}>{subtitle}</p>
                </div>
            </div>
        </div>
    );
};