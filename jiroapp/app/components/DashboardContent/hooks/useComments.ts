import { useState } from 'react';
import { Comment, Author } from '../types/dashboard.types';
import { api } from '@/app/auth/hooks/useTokenRefresh';
import toast from 'react-hot-toast';

interface ApiComment {
    id: number;
    text: string;
    creator: {
        id: number;
        username: string;
        tag: string;
        bio: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const useComments = (issueId: number) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<{
        id: number;
        authorName: string;
    } | null>(null);

    const transformApiComment = (comment: ApiComment): Comment => {
        return {
            id: comment.id,
            author: {
                name: comment.creator.username,
                avatar: null,
                role: 'Участник'
            },
            content: comment.text,
            createdAt: new Date(comment.createdAt).toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<ApiComment[]>(`/issues/${issueId}/comments`);
            const transformedComments = response.data.map(transformApiComment);
            setComments(transformedComments);
            return transformedComments;
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error);
            toast.error('Не удалось загрузить комментарии');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const addComment = async (content: string, currentUser: Author) => {
        if (!content.trim()) return null;

        try {
            setIsSubmitting(true);

            const optimisticComment: Comment = {
                id: Date.now(),
                author: currentUser,
                content: content.trim(),
                createdAt: new Date().toLocaleString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            setComments(prev => [...prev, optimisticComment]);

            const response = await api.post(`/issues/${issueId}/comments`, {
                message: content.trim()
            });

            const newComment = response.data;

            setComments(prev =>
                prev.map(comment =>
                    comment.id === optimisticComment.id ? transformApiComment(newComment) : comment
                )
            );

            toast.success('Комментарий добавлен');
            return newComment;
        } catch (error) {
            console.error('Ошибка при добавлении комментария:', error);
            setComments(prev => prev.filter(comment => comment.id !== Date.now()));
            toast.error('Не удалось добавить комментарий');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestDeleteComment = (commentId: number, authorName: string) => {
        setCommentToDelete({ id: commentId, authorName });
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return false;

        try {
            // Оптимистичное удаление
            const commentToRemove = comments.find(c => c.id === commentToDelete.id);
            setComments(prev => prev.filter(comment => comment.id !== commentToDelete.id));

            await api.delete(`/issues/${issueId}/comments/${commentToDelete.id}`);

            toast.success('Комментарий удален');
            setCommentToDelete(null);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error);
            if (commentToRemove) {
                setComments(prev => [...prev, commentToRemove].sort((a, b) => a.id - b.id));
            }
            toast.error('Не удалось удалить комментарий');
            setCommentToDelete(null);
            return false;
        }
    };

    const cancelDeleteComment = () => {
        setCommentToDelete(null);
    };

    const refreshComments = async () => {
        return await fetchComments();
    };

    return {
        comments,
        isLoading,
        isSubmitting,
        commentToDelete,
        addComment,
        requestDeleteComment,
        confirmDeleteComment,
        cancelDeleteComment,
        fetchComments,
        refreshComments
    };
};