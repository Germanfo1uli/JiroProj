'use client'

import { useEffect, useCallback, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { FaPlus, FaTrash, FaEdit, FaTimes, FaSave, FaCheck } from 'react-icons/fa'
import styles from './BoardManagerModal.module.css'

interface Board {
    id: number
    title: string
    color: string
}

const schema = z.object({
    title: z.string().min(1, 'Выберите название доски'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Неверный формат цвета'),
})

type FormData = z.infer<typeof schema>

interface BoardManagerModalProps {
    isOpen: boolean
    onClose: () => void
    boards: Board[]
    onSave: (boards: Board[]) => void
    getAvailableBoardTitles: () => Array<{ title: string; available: boolean }>
}

const MAX_BOARDS = 10

const predefinedColors = [
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#10b981',
    '#ef4444',
    '#ec4899',
    '#06b6d4',
    '#f97316',
]

export default function BoardManagerModal({
                                              isOpen,
                                              onClose,
                                              boards,
                                              onSave,
                                              getAvailableBoardTitles,
                                          }: BoardManagerModalProps) {
    const [boardsList, setBoardsList] = useState<Board[]>([...boards])
    const [editingBoardId, setEditingBoardId] = useState<number | null>(null)

    const {
        control: addControl,
        handleSubmit: handleAddSubmit,
        reset: resetAddForm,
        formState: { errors: addErrors, isSubmitting: isAdding },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            color: '#3b82f6',
        },
    })

    const {
        control: editControl,
        handleSubmit: handleEditSubmit,
        formState: { errors: editErrors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        if (isOpen) {
            setBoardsList([...boards])
            resetAddForm()
            setEditingBoardId(null)
        }
    }, [isOpen, boards, resetAddForm])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const availableTitles = useMemo(() => getAvailableBoardTitles(), [getAvailableBoardTitles, boardsList])

    const handleAddBoard = useCallback(
        (data: FormData) => {
            if (boardsList.length >= MAX_BOARDS) {
                toast.error(`Максимум ${MAX_BOARDS} досок`)
                return
            }

            const newBoard: Board = {
                id: Date.now(),
                title: data.title,
                color: data.color,
            }

            setBoardsList((prev) => [...prev, newBoard])
            resetAddForm()
            toast.success('Доска добавлена')
        },
        [boardsList.length, resetAddForm]
    )

    const handleDeleteBoard = useCallback((id: number) => {
        const board = boardsList.find((b) => b.id === id)
        if (!board) return

        if (confirm(`Удалить доску "${board.title}"?`)) {
            setBoardsList((prev) => prev.filter((b) => b.id !== id))
            toast.success('Доска удалена')
        }
    }, [boardsList])

    const startEditingBoard = useCallback((board: Board) => {
        setEditingBoardId(board.id)
    }, [])

    const handleEditBoard = useCallback(
        (data: FormData) => {
            if (editingBoardId === null) return

            setBoardsList((prev) =>
                prev.map((board) =>
                    board.id === editingBoardId
                        ? { ...board, title: data.title, color: data.color }
                        : board
                )
            )
            setEditingBoardId(null)
            toast.success('Доска обновлена')
        },
        [editingBoardId]
    )

    const cancelEditing = useCallback(() => {
        setEditingBoardId(null)
    }, [])

    const handleSave = useCallback(() => {
        onSave(boardsList)
        toast.success('Изменения сохранены')
        onClose()
    }, [boardsList, onSave, onClose])

    const hasDuplicates = useMemo(() => {
        const titles = boardsList.map((b) => b.title)
        return new Set(titles).size !== titles.length
    }, [boardsList])

    if (!isOpen) return null

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-title"
                        >
                            <div className={styles.modalHeader}>
                                <h2 id="modal-title" className={styles.modalTitle}>
                                    Управление досками
                                </h2>
                                <motion.button
                                    className={styles.closeButton}
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Закрыть"
                                >
                                    <FaTimes />
                                </motion.button>
                            </div>

                            <div className={styles.modalBody}>
                                <motion.div
                                    className={styles.addBoardSection}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h3 className={styles.sectionTitle}>Добавить новую доску</h3>
                                    <form onSubmit={handleAddSubmit(handleAddBoard)} className={styles.addBoardForm}>
                                        <Controller
                                            name="title"
                                            control={addControl}
                                            render={({ field }) => (
                                                <div className={styles.formGroup}>
                                                    <select
                                                        {...field}
                                                        className={`${styles.boardSelect} ${addErrors.title ? styles.error : ''}`}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    >
                                                        <option value="">Выберите название доски</option>
                                                        {availableTitles.map(({ title, available }) => (
                                                            <option
                                                                key={title}
                                                                value={title}
                                                                disabled={!available}
                                                                className={!available ? styles.disabledOption : ''}
                                                            >
                                                                {title} {!available ? '(уже используется)' : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {addErrors.title && (
                                                        <span className={styles.errorText}>{addErrors.title.message}</span>
                                                    )}
                                                </div>
                                            )}
                                        />

                                        <Controller
                                            name="color"
                                            control={addControl}
                                            render={({ field }) => (
                                                <div className={styles.colorPicker}>
                                                    {predefinedColors.map((color) => (
                                                        <motion.button
                                                            key={color}
                                                            type="button"
                                                            className={`${styles.colorOption} ${field.value === color ? styles.selected : ''}`}
                                                            style={{ backgroundColor: color }}
                                                            onClick={() => field.onChange(color)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            aria-label={`Выбрать цвет ${color}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        />

                                        <motion.button
                                            type="submit"
                                            className={`${styles.addButton} ${boardsList.length >= MAX_BOARDS ? styles.disabled : ''}`}
                                            disabled={isAdding}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FaPlus />
                                            {isAdding ? 'Добавление...' : 'Добавить доску'}
                                        </motion.button>
                                    </form>
                                </motion.div>

                                <motion.div
                                    className={styles.boardsListSection}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className={styles.sectionTitle}>Существующие доски</h3>
                                    <div className={styles.boardsList}>
                                        <AnimatePresence>
                                            {boardsList.map((board, index) => (
                                                <motion.div
                                                    key={board.id}
                                                    className={styles.boardItem}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {editingBoardId === board.id ? (
                                                        <form
                                                            onSubmit={handleEditSubmit(handleEditBoard)}
                                                            className={styles.editBoardForm}
                                                        >
                                                            <Controller
                                                                name="title"
                                                                control={editControl}
                                                                defaultValue={board.title}
                                                                render={({ field }) => (
                                                                    <select
                                                                        {...field}
                                                                        className={`${styles.boardSelect} ${editErrors.title ? styles.error : ''}`}
                                                                        onChange={(e) => field.onChange(e.target.value)}
                                                                    >
                                                                        {availableTitles.map(({ title, available }) => (
                                                                            <option
                                                                                key={title}
                                                                                value={title}
                                                                                disabled={!available && title !== board.title}
                                                                                className={!available && title !== board.title ? styles.disabledOption : ''}
                                                                            >
                                                                                {title} {!available && title !== board.title ? '(уже используется)' : ''}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            />

                                                            <Controller
                                                                name="color"
                                                                control={editControl}
                                                                defaultValue={board.color}
                                                                render={({ field }) => (
                                                                    <div className={styles.colorPicker}>
                                                                        {predefinedColors.map((color) => (
                                                                            <motion.button
                                                                                key={color}
                                                                                type="button"
                                                                                className={`${styles.colorOption} ${field.value === color ? styles.selected : ''}`}
                                                                                style={{ backgroundColor: color }}
                                                                                onClick={() => field.onChange(color)}
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            />

                                                            <div className={styles.editActions}>
                                                                <motion.button
                                                                    type="submit"
                                                                    className={styles.saveButton}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    aria-label="Сохранить"
                                                                >
                                                                    <FaCheck />
                                                                </motion.button>
                                                                <motion.button
                                                                    type="button"
                                                                    className={styles.cancelButton}
                                                                    onClick={cancelEditing}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    aria-label="Отмена"
                                                                >
                                                                    <FaTimes />
                                                                </motion.button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            <div className={styles.boardInfo}>
                                                                <motion.div
                                                                    className={styles.boardColorIndicator}
                                                                    style={{ backgroundColor: board.color }}
                                                                    whileHover={{ scale: 1.2 }}
                                                                />
                                                                <span className={styles.boardTitle}>{board.title}</span>
                                                            </div>
                                                            <div className={styles.boardActions}>
                                                                <motion.button
                                                                    className={styles.editButton}
                                                                    onClick={() => startEditingBoard(board)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    aria-label="Редактировать"
                                                                >
                                                                    <FaEdit />
                                                                </motion.button>
                                                                <motion.button
                                                                    className={styles.deleteButton}
                                                                    onClick={() => handleDeleteBoard(board.id)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    aria-label="Удалить"
                                                                >
                                                                    <FaTrash />
                                                                </motion.button>
                                                            </div>
                                                        </>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                className={styles.modalActions}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    className={styles.cancelButton}
                                    onClick={onClose}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Отмена
                                </motion.button>
                                <motion.button
                                    className={styles.saveButton}
                                    onClick={handleSave}
                                    disabled={hasDuplicates}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    title={hasDuplicates ? 'Исправьте дубликаты названий' : ''}
                                >
                                    <FaSave />
                                    Сохранить изменения
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}