export type Priority = 'low' | 'medium' | 'high';

export interface Author {
    name: string;
    avatar: string | null;
    role?: string;
}

export interface Attachment {
    id: number;
    name: string;
    url: string;
    size: string;
    type: string;
}

export interface Comment {
    id: number;
    author: Author;
    content: string;
    createdAt: string;
}

export interface Card {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    priorityLevel: number;
    author: Author;
    assignees?: Author[];
    tags: string[];
    progress: number;
    comments: number;
    attachments: number;
    attachmentsList?: Attachment[];
    commentsList?: Comment[];
    createdAt?: string;
}

export interface Board {
    id: number;
    title: string;
    color: string;
    cards: Card[];
}

export type SortOption = 'default' | 'alphabet' | 'priority' | 'author';
export type FilterOption = 'all' | Priority;

export interface DashboardState {
    searchQuery: string;
    isFilterOpen: boolean;
    expandedBoards: { [key: number]: boolean };
    collapsedBoards: { [key: number]: boolean };
    sortOption: SortOption;
    filterOption: FilterOption;
    isTreeViewOpen: boolean;
    isAddCardModalOpen: boolean;
    isBoardManagerOpen: boolean;
    isViewCardModalOpen: boolean;
    viewingCard: Card | null;
    editingCard: Card | null;
    currentBoardId: number;
    deleteConfirmation: {
        isOpen: boolean;
        cardId: number | null;
        cardTitle: string;
    };
}