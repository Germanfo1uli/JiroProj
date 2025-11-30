import { useState } from 'react';
import { Board, Card, SortOption, FilterOption, DashboardState, Priority } from '../types/dashboard.types';

const initialBoards: Board[] = [
    {
        id: 1,
        title: 'TO DO',
        color: '#3b82f6',
        cards: [
            {
                id: 1,
                title: 'Прототип главной страницы',
                description: 'Создать прототип главной страницы с основными компонентами и интерфейсом пользователя',
                priority: 'high',
                priorityLevel: 3,
                author: {
                    name: 'Алексей Петров',
                    avatar: null
                },
                tags: ['Дизайн', 'Прототип', 'UI/UX'],
                progress: 0,
                comments: 3,
                attachments: 2
            }
        ]
    },
    {
        id: 2,
        title: 'IN PROGRESS',
        color: '#f59e0b',
        cards: [
            {
                id: 2,
                title: 'Разработка API',
                description: 'Реализовать основные endpoints для работы с задачами и пользователями',
                priority: 'medium',
                priorityLevel: 2,
                author: {
                    name: 'Мария Иванова',
                    avatar: null
                },
                tags: ['Бэкенд', 'API', 'Node.js'],
                progress: 65,
                comments: 7,
                attachments: 5
            },
            {
                id: 3,
                title: 'Интеграция с базой данных',
                description: 'Настроить подключение и модели для работы с PostgreSQL и Redis',
                priority: 'high',
                priorityLevel: 3,
                author: {
                    name: 'Иван Сидоров',
                    avatar: null
                },
                tags: ['База данных', 'Настройка', 'PostgreSQL'],
                progress: 40,
                comments: 2,
                attachments: 4
            }
        ]
    },
    {
        id: 3,
        title: 'CODE REVIEW',
        color: '#8b5cf6',
        cards: [
            {
                id: 4,
                title: 'Тестирование компонентов',
                description: 'Провести unit и integration тесты для основных компонентов системы',
                priority: 'medium',
                priorityLevel: 2,
                author: {
                    name: 'Елена Козлова',
                    avatar: null
                },
                tags: ['Тестирование', 'QA', 'Jest'],
                progress: 100,
                comments: 5,
                attachments: 3
            }
        ]
    },
    {
        id: 4,
        title: 'DONE',
        color: '#10b981',
        cards: [
            {
                id: 5,
                title: 'Настройка проекта',
                description: 'Инициализация проекта и настройка базовых конфигураций, инструментов разработки',
                priority: 'low',
                priorityLevel: 1,
                author: {
                    name: 'Алексей Петров',
                    avatar: null
                },
                tags: ['Настройка', 'DevOps'],
                progress: 100,
                comments: 1,
                attachments: 0
            }
        ]
    }
];

const initialAuthors = [
    {
        name: 'Алексей Петров',
        avatar: null
    },
    {
        name: 'Мария Иванова',
        avatar: null
    },
    {
        name: 'Иван Сидоров',
        avatar: null
    },
    {
        name: 'Елена Козлова',
        avatar: null
    }
];

const availableBoardTitles = [
    'TO DO',
    'SELECTED FOR DEVELOPMENT',
    'IN PROGRESS',
    'CODE REVIEW',
    'QA',
    'STAGING',
    'DONE'
];

export const useDashboard = () => {
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [state, setState] = useState<DashboardState>({
        searchQuery: '',
        isFilterOpen: false,
        expandedBoards: {},
        collapsedBoards: {},
        sortOption: 'default',
        filterOption: 'all',
        isTreeViewOpen: false,
        isAddCardModalOpen: false,
        isBoardManagerOpen: false,
        editingCard: null,
        currentBoardId: 1,
        deleteConfirmation: {
            isOpen: false,
            cardId: null,
            cardTitle: ''
        }
    });

    const authors = initialAuthors;

    const updateState = (updates: Partial<DashboardState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const getPriorityColor = (priority: Priority): string => {
        const colors: Record<Priority, string> = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#ef4444'
        };
        return colors[priority] || '#6b7280';
    };

    const getPriorityBgColor = (priority: Priority): string => {
        const colors: Record<Priority, string> = {
            low: 'rgba(16, 185, 129, 0.15)',
            medium: 'rgba(245, 158, 11, 0.15)',
            high: 'rgba(239, 68, 68, 0.15)'
        };
        return colors[priority] || 'rgba(107, 114, 128, 0.1)';
    };

    const toggleBoardExpansion = (boardId: number): void => {
        setState(prev => ({
            ...prev,
            expandedBoards: {
                ...prev.expandedBoards,
                [boardId]: !prev.expandedBoards[boardId]
            }
        }));
    };

    const toggleBoardCollapse = (boardId: number): void => {
        setState(prev => ({
            ...prev,
            collapsedBoards: {
                ...prev.collapsedBoards,
                [boardId]: !prev.collapsedBoards[boardId]
            }
        }));
    };

    const handleSortChange = (option: SortOption): void => {
        updateState({ sortOption: option });
    };

    const handleFilterChange = (option: FilterOption): void => {
        updateState({ filterOption: option });
    };

    const openTreeView = (): void => {
        updateState({ isTreeViewOpen: true });
    };

    const closeTreeView = (): void => {
        updateState({ isTreeViewOpen: false });
    };

    const openAddCardModal = (): void => {
        updateState({ isAddCardModalOpen: true });
    };

    const closeAddCardModal = (): void => {
        updateState({ isAddCardModalOpen: false });
    };

    const openBoardManager = (): void => {
        updateState({ isBoardManagerOpen: true });
    };

    const closeBoardManager = (): void => {
        updateState({ isBoardManagerOpen: false });
    };

    const handleSaveBoards = (updatedBoards: Board[]): void => {
        setBoards(updatedBoards);
    };

    const handleAddCard = (data: { card: Card; boardIds: number[] }) => {
        const updatedBoards = boards.map(board => {
            if (data.boardIds.includes(board.id)) {
                return {
                    ...board,
                    cards: Array.isArray(board.cards) ? [...board.cards, data.card] : [data.card]
                };
            }
            return board;
        });
        setBoards(updatedBoards);
        closeAddCardModal();
    };

    const handleEditCard = (card: Card) => {
        updateState({ editingCard: card });
        const boardWithCard = boards.find(board =>
            board.cards && board.cards.some(c => c.id === card.id)
        );
        if (boardWithCard) {
            updateState({ currentBoardId: boardWithCard.id });
        }
    };

    const handleUpdateCard = (data: { card: Card; boardIds: number[] }) => {
        const updatedBoards = boards.map(board => {
            if (board.cards && board.cards.some(c => c.id === data.card.id) && !data.boardIds.includes(board.id)) {
                return {
                    ...board,
                    cards: board.cards.filter(c => c.id !== data.card.id)
                };
            }
            if (data.boardIds.includes(board.id)) {
                const cardExists = board.cards && board.cards.some(c => c.id === data.card.id);

                if (cardExists) {
                    return {
                        ...board,
                        cards: board.cards.map(c =>
                            c.id === data.card.id ? data.card : c
                        )
                    };
                } else {
                    return {
                        ...board,
                        cards: Array.isArray(board.cards) ? [...board.cards, data.card] : [data.card]
                    };
                }
            }

            return board;
        });

        setBoards(updatedBoards);
        updateState({ editingCard: null });
    };

    const handleDeleteCard = (cardId: number) => {
        const cardToDelete = boards
            .flatMap(board => board.cards || [])
            .find(card => card.id === cardId);

        if (cardToDelete) {
            updateState({
                deleteConfirmation: {
                    isOpen: true,
                    cardId,
                    cardTitle: cardToDelete.title
                }
            });
        }
    };

    const confirmDelete = () => {
        if (state.deleteConfirmation.cardId) {
            const updatedBoards = boards.map(board => ({
                ...board,
                cards: board.cards ? board.cards.filter(card => card.id !== state.deleteConfirmation.cardId) : []
            }));
            setBoards(updatedBoards);
            updateState({
                deleteConfirmation: { isOpen: false, cardId: null, cardTitle: '' }
            });
        }
    };

    const cancelDelete = () => {
        updateState({
            deleteConfirmation: { isOpen: false, cardId: null, cardTitle: '' }
        });
    };

    const filterAndSortCards = (cards: Card[]): Card[] => {
        if (!Array.isArray(cards)) {
            console.error('cards is not an array:', cards);
            return [];
        }

        let filteredCards = [...cards];

        if (state.searchQuery) {
            filteredCards = filteredCards.filter(card =>
                card.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                card.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                card.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
            );
        }

        if (state.filterOption !== 'all') {
            filteredCards = filteredCards.filter(card => card.priority === state.filterOption);
        }

        switch (state.sortOption) {
            case 'alphabet':
                filteredCards.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'priority':
                filteredCards.sort((a, b) => b.priorityLevel - a.priorityLevel);
                break;
            case 'author':
                filteredCards.sort((a, b) => a.author.name.localeCompare(b.author.name));
                break;
            default:
                break;
        }

        return filteredCards;
    };

    const getAvailableBoardTitles = () => {
        const existingTitles = boards.map(board => board.title);
        return availableBoardTitles.map(title => ({
            title,
            available: !existingTitles.includes(title)
        }));
    };

    return {
        boards,
        setBoards,
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
    };
};