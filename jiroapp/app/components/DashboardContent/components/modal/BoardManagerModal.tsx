'use client'

import { useState } from 'react'
import { FaPlus, FaTrash, FaEdit, FaTimes, FaSave } from 'react-icons/fa'
import styles from './BoardManagerModal.module.css'

interface Board {
    id: number
    title: string
    color: string
}

interface BoardManagerModalProps {
    isOpen: boolean
    onClose: () => void
    boards: Board[]
    onSave: (boards: Board[]) => void
    getAvailableBoardTitles: () => Array<{title: string, available: boolean}>
}

const BoardManagerModal = ({ isOpen, onClose, boards, onSave, getAvailableBoardTitles }: BoardManagerModalProps) => {
    const [boardsList, setBoardsList] = useState<Board[]>([...boards])
    const [selectedBoardTitle, setSelectedBoardTitle] = useState('')
    const [newBoardColor, setNewBoardColor] = useState('#3b82f6')
    const [editingBoardId, setEditingBoardId] = useState<number | null>(null)
    const [editBoardTitle, setEditBoardTitle] = useState('')
    const [editBoardColor, setEditBoardColor] = useState('')

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

    const availableTitles = getAvailableBoardTitles()

    const handleAddBoard = () => {
        if (selectedBoardTitle) {
            const newBoard: Board = {
                id: Date.now(),
                title: selectedBoardTitle,
                color: newBoardColor,
            }
            setBoardsList([...boardsList, newBoard])
            setSelectedBoardTitle('')
            setNewBoardColor('#3b82f6')
        }
    }

    const handleDeleteBoard = (id: number) => {
        setBoardsList(boardsList.filter(board => board.id !== id))
    }

    const startEditingBoard = (board: Board) => {
        setEditingBoardId(board.id)
        setEditBoardTitle(board.title)
        setEditBoardColor(board.color)
    }

    const saveEditedBoard = () => {
        if (editingBoardId !== null && editBoardTitle) {
            setBoardsList(boardsList.map(board =>
                board.id === editingBoardId
                    ? { ...board, title: editBoardTitle, color: editBoardColor }
                    : board
            ))
            cancelEditing()
        }
    }

    const cancelEditing = () => {
        setEditingBoardId(null)
        setEditBoardTitle('')
        setEditBoardColor('')
    }

    const handleSave = () => {
        onSave(boardsList)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Управление досками</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.addBoardSection}>
                        <h3 className={styles.sectionTitle}>Добавить новую доску</h3>
                        <div className={styles.addBoardForm}>
                            <select
                                className={styles.boardSelect}
                                value={selectedBoardTitle}
                                onChange={(e) => setSelectedBoardTitle(e.target.value)}
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
                            <div className={styles.colorPicker}>
                                {predefinedColors.map(color => (
                                    <button
                                        key={color}
                                        className={`${styles.colorOption} ${newBoardColor === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setNewBoardColor(color)}
                                    />
                                ))}
                            </div>
                            <button
                                className={`${styles.addButton} ${!selectedBoardTitle ? styles.disabled : ''}`}
                                onClick={handleAddBoard}
                                disabled={!selectedBoardTitle}
                            >
                                <FaPlus /> Добавить доску
                            </button>
                        </div>
                    </div>

                    <div className={styles.boardsListSection}>
                        <h3 className={styles.sectionTitle}>Существующие доски</h3>
                        <div className={styles.boardsList}>
                            {boardsList.map(board => (
                                <div key={board.id} className={styles.boardItem}>
                                    {editingBoardId === board.id ? (
                                        <div className={styles.editBoardForm}>
                                            <select
                                                className={styles.boardSelect}
                                                value={editBoardTitle}
                                                onChange={(e) => setEditBoardTitle(e.target.value)}
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
                                            <div className={styles.colorPicker}>
                                                {predefinedColors.map(color => (
                                                    <button
                                                        key={color}
                                                        className={`${styles.colorOption} ${editBoardColor === color ? styles.selected : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setEditBoardColor(color)}
                                                    />
                                                ))}
                                            </div>
                                            <div className={styles.editActions}>
                                                <button
                                                    className={`${styles.saveButton} ${!editBoardTitle ? styles.disabled : ''}`}
                                                    onClick={saveEditedBoard}
                                                    disabled={!editBoardTitle}
                                                >
                                                    <FaSave />
                                                </button>
                                                <button className={styles.cancelButton} onClick={cancelEditing}>
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.boardInfo}>
                                                <div
                                                    className={styles.boardColorIndicator}
                                                    style={{ backgroundColor: board.color }}
                                                />
                                                <span className={styles.boardTitle}>{board.title}</span>
                                            </div>
                                            <div className={styles.boardActions}>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => startEditingBoard(board)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteBoard(board.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Отмена
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BoardManagerModal