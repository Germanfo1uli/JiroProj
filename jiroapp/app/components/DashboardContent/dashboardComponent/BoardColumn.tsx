import {
    FaChevronDown,
    FaChevronUp,
    FaChevronRight,
    FaPlus
} from 'react-icons/fa';
import styles from '../Dashboard.module.css';
import TaskCard from '../components/TaskCard';
import { Board, Card } from '../types/dashboard.types';

interface BoardColumnProps {
    board: Board;
    filteredCards: Card[];
    isExpanded: boolean;
    isCollapsed: boolean;
    hasMultipleCards: boolean;
    showExpandButton: boolean;
    getPriorityColor: (priority: string) => string;
    getPriorityBgColor: (priority: string) => string;
    onToggleCollapse: (boardId: number) => void;
    onToggleExpansion: (boardId: number) => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (cardId: number) => void;
    onViewCard: (card: Card) => void;
    onAddCard: () => void;
}

export const BoardColumn = ({
                                board,
                                filteredCards,
                                isExpanded,
                                isCollapsed,
                                hasMultipleCards,
                                showExpandButton,
                                getPriorityColor,
                                getPriorityBgColor,
                                onToggleCollapse,
                                onToggleExpansion,
                                onEditCard,
                                onDeleteCard,
                                onViewCard,
                                onAddCard
                            }: BoardColumnProps) => {
    return (
        <div key={board.id} className={styles.boardColumn}>
            <div
                className={styles.boardHeader}
                style={{ borderLeftColor: board.color }}
                onClick={() => onToggleCollapse(board.id)}
            >
                <div className={styles.boardTitleSection}>
                    <div className={styles.collapseIcon}>
                        {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                    </div>
                    <div className={styles.boardColorIndicator} style={{ backgroundColor: board.color }}></div>
                    <h3 className={styles.boardTitle}>{board.title}</h3>
                </div>
                <div className={styles.boardHeaderRight}>
                    <span className={styles.cardsCount}>{filteredCards.length}</span>
                    {showExpandButton && !isCollapsed && (
                        <button
                            className={styles.expandBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleExpansion(board.id);
                            }}
                        >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            {!isExpanded && (
                                <span className={styles.hiddenCardsCount}>+{filteredCards.length - 1}</span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.cardsList}>
                    {filteredCards.length > 0 ? (
                        <>
                            <TaskCard
                                key={filteredCards[0].id}
                                card={filteredCards[0]}
                                getPriorityColor={getPriorityColor}
                                getPriorityBgColor={getPriorityBgColor}
                                onEdit={onEditCard}
                                onDelete={onDeleteCard}
                                onView={onViewCard}
                            />

                            {isExpanded && filteredCards.slice(1).map((card) => (
                                <TaskCard
                                    key={card.id}
                                    card={card}
                                    getPriorityColor={getPriorityColor}
                                    getPriorityBgColor={getPriorityBgColor}
                                    onEdit={onEditCard}
                                    onDelete={onDeleteCard}
                                    onView={onViewCard}
                                />
                            ))}

                            {!isExpanded && hasMultipleCards && (
                                <div className={styles.hiddenCardsIndicator}>
                                    <span className={styles.hiddenCardsText}>
                                        Еще {filteredCards.length - 1} задач{filteredCards.length - 1 > 1 ? 'и' : 'а'}
                                    </span>
                                    <button
                                        className={styles.showMoreBtn}
                                        onClick={() => onToggleExpansion(board.id)}
                                    >
                                        Показать все
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.noCardsMessage}>
                            Нет задач, соответствующих фильтрам
                        </div>
                    )}

                    <button
                        className={styles.addCardBtn}
                        onClick={onAddCard}
                    >
                        <FaPlus className={styles.addCardIcon} />
                        Добавить карточку
                    </button>
                </div>
            )}
        </div>
    );
};