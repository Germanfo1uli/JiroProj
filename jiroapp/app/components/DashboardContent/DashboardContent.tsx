'use client'

import styles from './Dashboard.module.css';
import { useDashboard } from './hooks/useDashboard';
import { DashboardHeader } from './dashboardComponent/DashboardHeader';
import { ControlsSection } from './dashboardComponent/ControlsSection';
import { BoardsGrid } from './dashboardComponent/BoardsGrid';
import TreeViewModal from './components/tree/TreeViewModal';
import AddCardModal from './components/modal/AddCardModal';
import ConfirmationModal from './components/modal/ConfirmationModal';
import BoardManagerModal from './components/modal/BoardManagerModal';
import EditCardModal from './components/modal/ EditCardModal';

export const DashboardContent = () => {
    const {
        boards,
        state,
        updateState,
        authors,
        getPriorityColor,
        getPriorityBgColor,
        toggleBoardExpansion,
        toggleBoardCollapse,
        handleSortChange,
        handleFilterChange,
        openTreeView,
        closeTreeView,
        openAddCardModal,
        closeAddCardModal,
        openBoardManager,
        closeBoardManager,
        handleSaveBoards,
        handleAddCard,
        handleEditCard,
        handleUpdateCard,
        handleDeleteCard,
        confirmDelete,
        cancelDelete,
        filterAndSortCards,
        getAvailableBoardTitles
    } = useDashboard();

    return (
        <div className={styles.boardsSection}>
            <DashboardHeader
                title="Мои доски"
                subtitle="Управляйте задачами и отслеживайте прогресс по проектам"
            />

            <ControlsSection
                searchQuery={state.searchQuery}
                onSearchChange={(query) => updateState({ searchQuery: query })}
                isFilterOpen={state.isFilterOpen}
                onFilterToggle={() => updateState({ isFilterOpen: !state.isFilterOpen })}
                sortOption={state.sortOption}
                onSortChange={handleSortChange}
                filterOption={state.filterOption}
                onFilterChange={handleFilterChange}
                onTreeViewOpen={openTreeView}
                onBoardManagerOpen={openBoardManager}
            />

            <BoardsGrid
                boards={boards}
                expandedBoards={state.expandedBoards}
                collapsedBoards={state.collapsedBoards}
                getPriorityColor={getPriorityColor}
                getPriorityBgColor={getPriorityBgColor}
                filterAndSortCards={filterAndSortCards}
                onToggleCollapse={toggleBoardCollapse}
                onToggleExpansion={toggleBoardExpansion}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onAddCard={openAddCardModal}
            />

            <TreeViewModal
                isOpen={state.isTreeViewOpen}
                onClose={closeTreeView}
                boards={boards}
                getPriorityColor={getPriorityColor}
            />

            <AddCardModal
                isOpen={state.isAddCardModalOpen}
                onClose={closeAddCardModal}
                onSave={handleAddCard}
                boards={boards}
                authors={authors}
            />

            <BoardManagerModal
                isOpen={state.isBoardManagerOpen}
                onClose={closeBoardManager}
                boards={boards}
                onSave={handleSaveBoards}
                getAvailableBoardTitles={getAvailableBoardTitles}
            />

            <EditCardModal
                isOpen={!!state.editingCard}
                onClose={() => updateState({ editingCard: null })}
                onSave={handleUpdateCard}
                card={state.editingCard}
                boards={boards}
                authors={authors}
                currentBoardId={state.currentBoardId}
            />

            <ConfirmationModal
                isOpen={state.deleteConfirmation.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Удаление карточки"
                message={`Вы уверены, что хотите удалить карточку "${state.deleteConfirmation.cardTitle}"? Это действие нельзя отменить.`}
                confirmText="Удалить карточку"
                cancelText="Отмена"
            />
        </div>
    );
};