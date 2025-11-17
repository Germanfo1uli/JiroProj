import { JSX } from 'react';
import {
    FaSearch,
    FaFilter,
    FaSortAlphaDown,
    FaExclamationCircle,
    FaUserCircle,
    FaChevronDown,
    FaChevronUp,
    FaSitemap,
    FaCog,
    FaFlag,
    FaRegFlag
} from 'react-icons/fa';
import styles from '../Dashboard.module.css';
import { SortOption, FilterOption, Priority } from '../types/dashboard.types';

interface ControlsSectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isFilterOpen: boolean;
    onFilterToggle: () => void;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    filterOption: FilterOption;
    onFilterChange: (option: FilterOption) => void;
    onTreeViewOpen: () => void;
    onBoardManagerOpen: () => void;
}

const getFilterPriorityIcon = (priority: Priority): JSX.Element => {
    switch (priority) {
        case 'high':
            return <FaFlag className={styles.filterPriorityIcon} style={{ color: '#ef4444' }} />;
        case 'medium':
            return <FaFlag className={styles.filterPriorityIcon} style={{ color: '#f59e0b' }} />;
        case 'low':
            return <FaRegFlag className={styles.filterPriorityIcon} style={{ color: '#10b981' }} />;
        default:
            return <FaRegFlag className={styles.filterPriorityIcon} />;
    }
};

export const ControlsSection = ({
                                    searchQuery,
                                    onSearchChange,
                                    isFilterOpen,
                                    onFilterToggle,
                                    sortOption,
                                    onSortChange,
                                    filterOption,
                                    onFilterChange,
                                    onTreeViewOpen,
                                    onBoardManagerOpen
                                }: ControlsSectionProps) => {
    return (
        <div className={styles.controlsSection}>
            <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск задач..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.controlButtons}>
                <button
                    className={styles.treeViewBtn}
                    onClick={onTreeViewOpen}
                >
                    <FaSitemap className={styles.treeViewIcon} />
                    Показать дерево
                </button>

                <button
                    className={styles.boardManagerBtn}
                    onClick={onBoardManagerOpen}
                >
                    <FaCog className={styles.boardManagerIcon} />
                    Управление досками
                </button>

                <div className={styles.filterContainer}>
                    <button
                        className={styles.filterBtn}
                        onClick={onFilterToggle}
                    >
                        <FaFilter className={styles.filterIcon} />
                        Фильтр и сортировка
                        {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {isFilterOpen && (
                        <div className={styles.filterDropdown}>
                            <div className={styles.filterSection}>
                                <h4>Сортировка</h4>
                                <div className={styles.filterOptions}>
                                    <button
                                        className={`${styles.filterOption} ${sortOption === 'default' ? styles.active : ''}`}
                                        onClick={() => onSortChange('default')}
                                    >
                                        По умолчанию
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${sortOption === 'alphabet' ? styles.active : ''}`}
                                        onClick={() => onSortChange('alphabet')}
                                    >
                                        <FaSortAlphaDown /> По алфавиту
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${sortOption === 'priority' ? styles.active : ''}`}
                                        onClick={() => onSortChange('priority')}
                                    >
                                        <FaExclamationCircle /> По важности
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${sortOption === 'author' ? styles.active : ''}`}
                                        onClick={() => onSortChange('author')}
                                    >
                                        <FaUserCircle /> По исполнителю
                                    </button>
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h4>Фильтр по приоритету</h4>
                                <div className={styles.filterOptions}>
                                    <button
                                        className={`${styles.filterOption} ${filterOption === 'all' ? styles.active : ''}`}
                                        onClick={() => onFilterChange('all')}
                                    >
                                        Все задачи
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${filterOption === 'high' ? styles.active : ''}`}
                                        onClick={() => onFilterChange('high')}
                                    >
                                        {getFilterPriorityIcon('high')} Высокий приоритет
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${filterOption === 'medium' ? styles.active : ''}`}
                                        onClick={() => onFilterChange('medium')}
                                    >
                                        {getFilterPriorityIcon('medium')} Средний приоритет
                                    </button>
                                    <button
                                        className={`${styles.filterOption} ${filterOption === 'low' ? styles.active : ''}`}
                                        onClick={() => onFilterChange('low')}
                                    >
                                        {getFilterPriorityIcon('low')} Низкий приоритет
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};