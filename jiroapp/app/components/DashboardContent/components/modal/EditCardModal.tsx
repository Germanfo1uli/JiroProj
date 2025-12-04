'use client'

import { useEffect, useCallback, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { z } from 'zod'
import {
    FaTimes,
    FaSave,
    FaUserCircle,
    FaTag,
    FaExclamationTriangle,
    FaPaperclip,
    FaTrash,
    FaCloudUploadAlt,
    FaFile,
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaCode,
    FaImage
} from 'react-icons/fa'
import styles from './EditCardModal.module.css'

// Типы
type Priority = 'low' | 'medium' | 'high'

interface Author {
    name: string
    avatar: string | null
}

interface Board {
    id: number
    title: string
    color: string
}

interface Card {
    id: number
    title: string
    description: string
    priority: Priority
    priorityLevel: number
    author: Author
    tags: string[]
    progress: number
    comments: number
    attachments: number
}

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    url: string
    preview?: string
}

// Схема валидации
const schema = z.object({
    title: z.string().min(1, 'Название задачи обязательно').max(200, 'Слишком длинное название'),
    description: z.string().max(2000, 'Описание слишком длинное').optional(),
    priority: z.enum(['low', 'medium', 'high']),
    authorId: z.string().min(1, 'Выберите исполнителя'),
    tags: z.array(z.string()).max(10, 'Максимум 10 тегов'),
    selectedBoards: z.array(z.number()).min(1, 'Выберите хотя бы одну доску'),
})

type FormData = z.infer<typeof schema>

interface EditCardModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: { card: Card; boardIds: number[]; files: UploadedFile[] }) => void
    card: Card | null
    boards: Board[]
    authors: Author[]
    currentBoardId: number
}

export default function EditCardModal({
                                          isOpen,
                                          onClose,
                                          onSave,
                                          card,
                                          boards,
                                          authors,
                                          currentBoardId,
                                      }: EditCardModalProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            authorId: authors[0]?.name || '',
            tags: [],
            selectedBoards: [currentBoardId],
        },
    })

    useEffect(() => {
        if (card && isOpen) {
            reset({
                title: card.title,
                description: card.description,
                priority: card.priority,
                authorId: card.author.name,
                tags: [...card.tags],
                selectedBoards: [currentBoardId],
            })
        }
    }, [card, currentBoardId, isOpen, reset])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const tags = watch('tags')

    const handleAddTag = useCallback((value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return
        if (tags.includes(trimmed)) {
            toast.error('Тег уже существует')
            return
        }
        if (tags.length >= 10) {
            toast.error('Максимум 10 тегов')
            return
        }
        setValue('tags', [...tags, trimmed], { shouldDirty: true })
    }, [tags, setValue])

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        setValue(
            'tags',
            tags.filter((t) => t !== tagToRemove),
            { shouldDirty: true }
        )
    }, [tags, setValue])

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: UploadedFile[] = acceptedFiles.map((file) => {
            const fileId = Math.random().toString(36).substring(2, 11)
            const fileUrl = URL.createObjectURL(file)
            return {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                url: fileUrl,
                preview: file.type.startsWith('image/') ? fileUrl : undefined,
            }
        })
        setUploadedFiles((prev) => [...prev, ...newFiles])
        toast.success(`Добавлено ${newFiles.length} файл(ов)`)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 10,
        maxSize: 50 * 1024 * 1024,
        onDropRejected: (fileRejections) => {
            fileRejections.forEach((rejection) => {
                rejection.errors.forEach((error) => {
                    if (error.code === 'file-too-large') {
                        toast.error('Файл слишком большой (макс. 50MB)')
                    } else {
                        toast.error(error.message)
                    }
                })
            })
        },
    })

    const handleRemoveFile = useCallback((fileId: string) => {
        setUploadedFiles((prev) => {
            const file = prev.find((f) => f.id === fileId)
            if (file?.url) URL.revokeObjectURL(file.url)
            return prev.filter((f) => f.id !== fileId)
        })
        toast.success('Файл удален')
    }, [])

    const formatFileSize = useCallback((bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }, [])

    const getFileIcon = useCallback((fileType: string) => {
        if (fileType.includes('pdf')) return <FaFilePdf className={styles.fileIconPdf} />
        if (fileType.includes('word') || fileType.includes('document'))
            return <FaFileWord className={styles.fileIconWord} />
        if (fileType.includes('excel') || fileType.includes('spreadsheet'))
            return <FaFileExcel className={styles.fileIconExcel} />
        if (fileType.includes('zip') || fileType.includes('archive'))
            return <FaFile className={styles.fileIconDefault} />
        if (fileType.includes('image')) return <FaImage className={styles.fileIconDesign} />
        if (
            fileType.includes('text') ||
            fileType.includes('json') ||
            fileType.includes('xml') ||
            fileType.includes('html') ||
            fileType.includes('css') ||
            fileType.includes('javascript')
        )
            return <FaCode className={styles.fileIconCode} />
        return <FaFile className={styles.fileIconDefault} />
    }, [])

    const selectedBoards = watch('selectedBoards')

    const handleBoardToggle = useCallback(
        (boardId: number) => {
            const newSelection = selectedBoards.includes(boardId)
                ? selectedBoards.filter((id) => id !== boardId)
                : [...selectedBoards, boardId]
            setValue('selectedBoards', newSelection, { shouldDirty: true, shouldValidate: true })
        },
        [selectedBoards, setValue]
    )

    const onSubmit = useCallback(
        (data: FormData) => {
            if (!card) return

            const selectedAuthor = authors.find((a) => a.name === data.authorId) || authors[0]

            const updatedCard: Card = {
                ...card,
                title: data.title,
                description: data.description,
                priority: data.priority,
                priorityLevel: data.priority === 'high' ? 3 : data.priority === 'medium' ? 2 : 1,
                author: selectedAuthor,
                tags: data.tags,
                attachments: uploadedFiles.length,
            }

            onSave({
                card: updatedCard,
                boardIds: data.selectedBoards,
                files: uploadedFiles,
            })

            toast.success('Карточка успешно сохранена')
            onClose()
        },
        [card, authors, uploadedFiles, onSave, onClose]
    )

    if (!isOpen || !card) return null

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
                                    Редактировать карточку
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

                            <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
                                <div className={styles.formSection}>
                                    <label className={styles.formLabel}>
                                        <span className={styles.labelText}>Название задачи *</span>
                                        <input
                                            type="text"
                                            className={`${styles.textInput} ${errors.title ? styles.error : ''}`}
                                            {...register('title')}
                                            placeholder="Введите название задачи..."
                                            autoFocus
                                        />
                                        {errors.title && (
                                            <span className={styles.errorText}>{errors.title.message}</span>
                                        )}
                                    </label>
                                </div>

                                <div className={styles.formSection}>
                                    <label className={styles.formLabel}>
                                        <span className={styles.labelText}>Описание</span>
                                        <textarea
                                            className={styles.textarea}
                                            {...register('description')}
                                            placeholder="Опишите задачу подробнее..."
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <span className={styles.errorText}>{errors.description.message}</span>
                                        )}
                                    </label>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formSection}>
                                        <label className={styles.formLabel}>
                      <span className={styles.labelText}>
                        <FaExclamationTriangle className={styles.labelIcon} />
                        Приоритет
                      </span>
                                            <select className={styles.select} {...register('priority')}>
                                                <option value="low">Низкий</option>
                                                <option value="medium">Средний</option>
                                                <option value="high">Высокий</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className={styles.formSection}>
                                        <label className={styles.formLabel}>
                      <span className={styles.labelText}>
                        <FaUserCircle className={styles.labelIcon} />
                        Исполнитель
                      </span>
                                            <select className={styles.select} {...register('authorId')}>
                                                {authors.map((author) => (
                                                    <option key={author.name} value={author.name}>
                                                        {author.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formSection}>
                                    <label className={styles.formLabel}>
                    <span className={styles.labelText}>
                      <FaTag className={styles.labelIcon} />
                      Теги
                    </span>
                                        <Controller
                                            name="tags"
                                            control={control}
                                            render={({ field }) => (
                                                <div className={styles.tagsWrapper}>
                                                    <div className={styles.tagsInputContainer}>
                                                        <input
                                                            type="text"
                                                            className={styles.textInput}
                                                            placeholder="Введите тег и нажмите Enter..."
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault()
                                                                    handleAddTag((e.target as HTMLInputElement).value)
                                                                    ;(e.target as HTMLInputElement).value = ''
                                                                }
                                                            }}
                                                        />
                                                        <motion.button
                                                            type="button"
                                                            className={styles.addTagButton}
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                                                handleAddTag(input.value)
                                                                input.value = ''
                                                            }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            Добавить
                                                        </motion.button>
                                                    </div>
                                                    <div className={styles.tagsContainer}>
                                                        <AnimatePresence>
                                                            {field.value.map((tag, index) => (
                                                                <motion.span
                                                                    key={tag}
                                                                    className={styles.tag}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                >
                                                                    {tag}
                                                                    <motion.button
                                                                        type="button"
                                                                        className={styles.removeTagButton}
                                                                        onClick={() => handleRemoveTag(tag)}
                                                                        whileHover={{ scale: 1.2, rotate: 90 }}
                                                                    >
                                                                        ×
                                                                    </motion.button>
                                                                </motion.span>
                                                            ))}
                                                        </AnimatePresence>
                                                    </div>
                                                    {errors.tags && (
                                                        <span className={styles.errorText}>{errors.tags.message}</span>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </label>
                                </div>

                                <div className={styles.formSection}>
                                    <label className={styles.formLabel}>
                    <span className={styles.labelText}>
                      <FaPaperclip className={styles.labelIcon} />
                      Прикрепленные файлы
                    </span>

                                        <motion.div
                                            {...getRootProps()}
                                            className={`${styles.fileUploadArea} ${isDragActive ? styles.dragActive : ''}`}
                                            whileHover={{ y: -2 }}
                                        >
                                            <input {...getInputProps()} />
                                            <div className={styles.uploadPlaceholder}>
                                                <FaCloudUploadAlt className={styles.uploadIcon} />
                                                <div className={styles.uploadText}>
                                                    <p>{isDragActive ? 'Отпустите файлы' : 'Перетащите файлы сюда или нажмите'}</p>
                                                    <span>Макс. 50MB, до 10 файлов</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <AnimatePresence>
                                            {uploadedFiles.length > 0 && (
                                                <motion.div
                                                    className={styles.uploadedFiles}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <h4 className={styles.filesTitle}>
                                                        Прикрепленные файлы ({uploadedFiles.length})
                                                    </h4>
                                                    <div className={styles.filesList}>
                                                        {uploadedFiles.map((file, index) => (
                                                            <motion.div
                                                                key={file.id}
                                                                className={styles.fileItem}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 20 }}
                                                                transition={{ delay: index * 0.05 }}
                                                            >
                                                                <div className={styles.fileInfo}>
                                                                    <div className={styles.fileIcon}>{getFileIcon(file.type)}</div>
                                                                    <div className={styles.fileDetails}>
                                                                        <span className={styles.fileName}>{file.name}</span>
                                                                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                                                    </div>
                                                                </div>
                                                                <motion.button
                                                                    type="button"
                                                                    className={styles.removeFileButton}
                                                                    onClick={() => handleRemoveFile(file.id)}
                                                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FaTrash />
                                                                </motion.button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </label>
                                </div>

                                <div className={styles.formSection}>
                                    <label className={styles.formLabel}>
                                        <span className={styles.labelText}>Разместить на досках *</span>
                                        <Controller
                                            name="selectedBoards"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <div className={styles.boardsGrid}>
                                                        {boards.map((board) => (
                                                            <motion.label
                                                                key={board.id}
                                                                className={styles.boardCheckboxLabel}
                                                                style={{ '--board-color': board.color } as React.CSSProperties}
                                                                whileHover={{ y: -2 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value.includes(board.id)}
                                                                    onChange={() => handleBoardToggle(board.id)}
                                                                    className={styles.boardCheckbox}
                                                                />
                                                                <span className={styles.boardCheckboxCustom}></span>
                                                                <span className={styles.boardTitle}>{board.title}</span>
                                                            </motion.label>
                                                        ))}
                                                    </div>
                                                    {errors.selectedBoards && (
                                                        <span className={styles.errorText}>
                              {errors.selectedBoards.message}
                            </span>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </label>
                                </div>

                                <div className={styles.modalActions}>
                                    <motion.button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={onClose}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Отмена
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className={styles.saveButton}
                                        disabled={isSubmitting || (!isDirty && uploadedFiles.length === 0)}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaSave className={styles.saveIcon} />
                                        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}