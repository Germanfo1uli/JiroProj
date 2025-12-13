import styles from '../Dashboard.module.css';
import { Board, Card } from '../types/dashboard.types';
import { BoardColumn } from './BoardColumn';

interface BoardsGridProps {
    boards: Board[];
    expandedBoards: { [key: number]: boolean };
    collapsedBoards: { [key: number]: boolean };
    getPriorityColor: (priority: string) => string;
    getPriorityBgColor: (priority: string) => string;
    filterAndSortCards: (cards: Card[]) => Card[];
    onToggleCollapse: (boardId: number) => void;
    onToggleExpansion: (boardId: number) => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (cardId: number) => void;
    onViewCard: (card: Card) => void;
    onAddCard: () => void;
}

export const BoardsGrid = ({
                               boards,
                               expandedBoards,
                               collapsedBoards,
                               getPriorityColor,
                               getPriorityBgColor,
                               filterAndSortCards,
                               onToggleCollapse,
                               onToggleExpansion,
                               onEditCard,
                               onDeleteCard,
                               onViewCard,
                               onAddCard
                           }: BoardsGridProps) => {
    return (
        <div className={styles.boardsContainer}>
            <div className={styles.boardsGrid}>
                {boards.map((board) => {
                    const filteredCards = filterAndSortCards(board.cards);
                    const isExpanded = expandedBoards[board.id];
                    const isCollapsed = collapsedBoards[board.id];
                    const hasMultipleCards = filteredCards.length > 1;
                    const showExpandButton = hasMultipleCards;

                    return (
                        <BoardColumn
                            key={board.id}
                            board={board}
                            filteredCards={filteredCards}
                            isExpanded={isExpanded}
                            isCollapsed={isCollapsed}
                            hasMultipleCards={hasMultipleCards}
                            showExpandButton={showExpandButton}
                            getPriorityColor={getPriorityColor}
                            getPriorityBgColor={getPriorityBgColor}
                            onToggleCollapse={onToggleCollapse}
                            onToggleExpansion={onToggleExpansion}
                            onEditCard={onEditCard}
                            onDeleteCard={onDeleteCard}
                            onViewCard={onViewCard}
                            onAddCard={onAddCard}
                        />
                    );
                })}
            </div>
        </div>
    );
};