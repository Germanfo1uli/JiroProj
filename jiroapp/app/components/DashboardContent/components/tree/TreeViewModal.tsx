'use client'

import { JSX, useState, useEffect, useCallback, useMemo } from 'react'
import {
    FaTimes,
    FaFile,
    FaFolder,
    FaFolderOpen,
    FaChevronRight,
    FaChevronDown,
    FaUserCircle,
    FaPaperclip,
    FaDownload,
    FaCode,
    FaImage,
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaTag,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaUsers,
    FaChartBar,
    FaDatabase,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaCopy,
    FaEye,
    FaEyeSlash,
    FaExternalLinkAlt,
    FaShare,
    FaBookmark,
    FaRegBookmark,
    FaStar,
    FaRegStar
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TreeViewModal.module.css'

type Priority = 'low' | 'medium' | 'high'

interface Author {
    id: number
    name: string
    avatar: string | null
    role: string
    email: string
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
    createdAt: string
    dueDate?: string
    status: 'todo' | 'in-progress' | 'review' | 'done'
}

interface Board {
    id: number
    title: string
    color: string
    cards: Card[]
    description?: string
    createdAt: string
}

interface TreeViewModalProps {
    isOpen: boolean
    onClose: () => void
    boards: Board[]
    getPriorityColor: (priority: Priority) => string
}

interface TreeNode {
    id: string
    name: string
    type: 'board' | 'card' | 'file' | 'folder'
    children?: TreeNode[]
    data?: Card | Board | any
    expanded?: boolean
    icon?: JSX.Element
    badge?: {
        count: number
        color: string
    }
}

interface SearchResult {
    node: TreeNode
    path: string[]
    matchScore: number
}

const TreeViewModal = ({ isOpen, onClose, boards, getPriorityColor }: TreeViewModalProps) => {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'board' | 'card' | 'file'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'priority' | 'date'>('name')
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(false)
    const [showEmpty, setShowEmpty] = useState(false)
    const [favoriteNodes, setFavoriteNodes] = useState<Set<string>>(new Set())

    useEffect(() => {
        const generateTreeData = () => {
            const generateFiles = (cardId: number) => [
                {
                    id: `${cardId}-1`,
                    name: 'Техническое задание.docx',
                    size: '2.4 MB',
                    type: 'word',
                    uploadedAt: '2024-01-15',
                    uploadedBy: 'Алексей Петров'
                },
                {
                    id: `${cardId}-2`,
                    name: 'Дизайн макет.sketch',
                    size: '5.1 MB',
                    type: 'design',
                    uploadedAt: '2024-01-16',
                    uploadedBy: 'Мария Иванова'
                },
                {
                    id: `${cardId}-3`,
                    name: 'requirements.pdf',
                    size: '1.2 MB',
                    type: 'pdf',
                    uploadedAt: '2024-01-14',
                    uploadedBy: 'Иван Сидоров'
                },
                {
                    id: `${cardId}-4`,
                    name: 'api-specification.json',
                    size: '0.8 MB',
                    type: 'code',
                    uploadedAt: '2024-01-17',
                    uploadedBy: 'Елена Козлова'
                },
                {
                    id: `${cardId}-5`,
                    name: 'project-timeline.xlsx',
                    size: '1.5 MB',
                    type: 'excel',
                    uploadedAt: '2024-01-18',
                    uploadedBy: 'Алексей Петров'
                }
            ]

            const generateFolders = (cardId: number) => [
                {
                    id: `${cardId}-docs`,
                    name: 'Документация',
                    type: 'folder',
                    expanded: false,
                    children: [
                        { id: `${cardId}-1`, name: 'ТЗ.docx', type: 'word', data: generateFiles(cardId)[0] },
                        { id: `${cardId}-3`, name: 'requirements.pdf', type: 'pdf', data: generateFiles(cardId)[2] }
                    ]
                },
                {
                    id: `${cardId}-design`,
                    name: 'Дизайн',
                    type: 'folder',
                    expanded: false,
                    children: [
                        { id: `${cardId}-2`, name: 'Макеты.sketch', type: 'design', data: generateFiles(cardId)[1] }
                    ]
                },
                {
                    id: `${cardId}-code`,
                    name: 'Исходный код',
                    type: 'folder',
                    expanded: false,
                    children: [
                        { id: `${cardId}-4`, name: 'API спецификация.json', type: 'code', data: generateFiles(cardId)[3] }
                    ]
                }
            ]

            return boards.map(board => ({
                id: `board-${board.id}`,
                name: board.title,
                type: 'board',
                data: board,
                expanded: true,
                badge: {
                    count: board.cards.length,
                    color: board.color
                },
                children: board.cards.map(card => ({
                    id: `card-${card.id}`,
                    name: card.title,
                    type: 'card',
                    data: card,
                    expanded: false,
                    badge: {
                        count: card.attachments,
                        color: getPriorityColor(card.priority)
                    },
                    children: [
                        {
                            id: `${card.id}-folders`,
                            name: 'Файлы',
                            type: 'folder',
                            expanded: false,
                            children: generateFolders(card.id)
                        }
                    ]
                }))
            }))
        }

        if (isOpen) {
            setIsLoading(true)
            setTimeout(() => {
                setTreeData(generateTreeData())
                setIsLoading(false)

                const initialExpanded = new Set(['board-1', 'board-2'])
                setExpandedNodes(initialExpanded)
            }, 300)
        }
    }, [isOpen, boards, getPriorityColor])

    const toggleNode = useCallback((nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId)
            } else {
                newSet.add(nodeId)
            }
            return newSet
        })
    }, [])

    const toggleAll = useCallback((expand: boolean) => {
        if (expand) {
            const allNodeIds: string[] = []
            const collectIds = (nodes: TreeNode[]) => {
                nodes.forEach(node => {
                    allNodeIds.push(node.id)
                    if (node.children) {
                        collectIds(node.children)
                    }
                })
            }
            collectIds(treeData)
            setExpandedNodes(new Set(allNodeIds))
        } else {
            setExpandedNodes(new Set())
        }
    }, [treeData])

    const getFileIcon = useCallback((fileType: string) => {
        const iconProps = { className: styles.fileIcon }
        switch (fileType) {
            case 'pdf': return <FaFilePdf {...iconProps} style={{ color: '#ef4444' }} />
            case 'word': return <FaFileWord {...iconProps} style={{ color: '#2563eb' }} />
            case 'excel': return <FaFileExcel {...iconProps} style={{ color: '#16a34a' }} />
            case 'code': return <FaCode {...iconProps} style={{ color: '#7c3aed' }} />
            case 'design': return <FaImage {...iconProps} style={{ color: '#ec4899' }} />
            default: return <FaFile {...iconProps} style={{ color: '#64748b' }} />
        }
    }, [])

    const getPriorityLabel = useCallback((priority: Priority) => {
        switch (priority) {
            case 'high': return 'Высокий'
            case 'medium': return 'Средний'
            case 'low': return 'Низкий'
            default: return 'Не указан'
        }
    }, [])

    const getStatusIcon = useCallback((status: string) => {
        switch (status) {
            case 'done': return <FaCheckCircle style={{ color: '#10b981' }} />
            case 'in-progress': return <FaClock style={{ color: '#f59e0b' }} />
            case 'review': return <FaEye style={{ color: '#3b82f6' }} />
            case 'todo': return <FaExclamationTriangle style={{ color: '#64748b' }} />
            default: return <FaClock style={{ color: '#64748b' }} />
        }
    }, [])

    const toggleFavorite = useCallback((nodeId: string) => {
        setFavoriteNodes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId)
            } else {
                newSet.add(nodeId)
            }
            return newSet
        })
    }, [])

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return []

        const results: SearchResult[] = []

        const searchNode = (node: TreeNode, path: string[] = []): number => {
            let matchScore = 0

            if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                matchScore += 100
            }

            if (node.type === filterType || filterType === 'all') {
                matchScore += 50
            }

            if (node.data) {
                if (node.data.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
                    matchScore += 80
                }
                if (node.data.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
                    matchScore += 30
                }
                if (node.data.tags?.some((tag: string) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
                    matchScore += 40
                }
            }

            if (matchScore > 0) {
                results.push({
                    node,
                    path,
                    matchScore
                })
            }

            if (node.children) {
                node.children.forEach(child => {
                    searchNode(child, [...path, node.name])
                })
            }

            return matchScore
        }

        treeData.forEach(node => searchNode(node))

        return results.sort((a, b) => b.matchScore - a.matchScore)
    }, [searchQuery, treeData, filterType])

    const filteredTreeData = useMemo(() => {
        if (!searchQuery.trim()) return treeData

        const shouldShowNode = (node: TreeNode): boolean => {
            return searchResults.some(result => result.node.id === node.id) ||
                node.children?.some(child => shouldShowNode(child))
        }

        const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
            return nodes
                .filter(shouldShowNode)
                .map(node => ({
                    ...node,
                    children: node.children ? filterNodes(node.children) : undefined
                }))
        }

        return filterNodes(treeData)
    }, [treeData, searchQuery, searchResults])

    const TreeNode = ({ node, level = 0, path = [] }: {
        node: TreeNode;
        level?: number;
        path?: string[]
    }) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = expandedNodes.has(node.id)
        const isFavorite = favoriteNodes.has(node.id)
        const isSelected = selectedNode?.id === node.id
        const isBoard = node.type === 'board'
        const isCard = node.type === 'card'
        const isFile = node.type === 'file'
        const isFolder = node.type === 'folder'

        const handleClick = () => {
            if (hasChildren) {
                toggleNode(node.id)
            }
            setSelectedNode(node)
        }

        const handleFavorite = (e: React.MouseEvent) => {
            e.stopPropagation()
            toggleFavorite(node.id)
        }

        const handleCopyPath = (e: React.MouseEvent) => {
            e.stopPropagation()
            const fullPath = [...path, node.name].join(' → ')
            navigator.clipboard.writeText(fullPath)
        }

        const renderNodeIcon = () => {
            if (isFolder) {
                return isExpanded ?
                    <FaFolderOpen className={styles.treeFolderIcon} /> :
                    <FaFolder className={styles.treeFolderIcon} />
            }
            if (isCard) {
                return isExpanded ?
                    <FaFolderOpen className={styles.treeFolderIcon} /> :
                    <FaFolder className={styles.treeFolderIcon} />
            }
            if (isBoard) {
                return (
                    <div
                        className={styles.treeBoardIcon}
                        style={{ backgroundColor: (node.data as Board)?.color }}
                    />
                )
            }
            if (isFile) {
                return getFileIcon(node.data?.type)
            }
            return null
        }

        const renderNodeBadge = () => {
            if (node.badge) {
                return (
                    <span
                        className={styles.treeNodeBadge}
                        style={{
                            backgroundColor: node.badge.color,
                            color: node.badge.color === '#ffffff' ? '#000' : '#fff'
                        }}
                    >
                        {node.badge.count}
                    </span>
                )
            }
            return null
        }

        const renderNodeActions = () => {
            return (
                <div className={styles.treeNodeActions}>
                    <button
                        className={styles.treeNodeAction}
                        onClick={handleFavorite}
                        title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                    </button>
                    <button
                        className={styles.treeNodeAction}
                        onClick={handleCopyPath}
                        title="Копировать путь"
                    >
                        <FaCopy />
                    </button>
                    {isFile && (
                        <button
                            className={styles.treeNodeAction}
                            title="Скачать файл"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            <FaDownload />
                        </button>
                    )}
                </div>
            )
        }

        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: level * 0.05 }}
                className={styles.treeNode}
            >
                <motion.div
                    className={`${styles.treeNodeHeader} ${
                        isBoard ? styles.boardNode :
                            isCard ? styles.cardNode :
                                isFolder ? styles.folderNode :
                                    styles.fileNode
                    } ${isSelected ? styles.selectedNode : ''}`}
                    style={{
                        paddingLeft: `${level * 24 + 16}px`,
                    }}
                    onClick={handleClick}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className={styles.treeNodeLeft}>
                        {hasChildren && (
                            <motion.span
                                className={styles.treeExpandIcon}
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaChevronRight />
                            </motion.span>
                        )}

                        {!hasChildren && !isFile && (
                            <span className={styles.treePlaceholder} />
                        )}

                        {renderNodeIcon()}

                        <span className={styles.treeNodeName} title={node.name}>
                            {node.name}
                        </span>

                        {renderNodeBadge()}
                    </div>

                    <div className={styles.treeNodeRight}>
                        {isCard && (
                            <div
                                className={styles.treePriorityBadge}
                                style={{
                                    backgroundColor: getPriorityColor((node.data as Card).priority),
                                }}
                                title={`Приоритет: ${getPriorityLabel((node.data as Card).priority)}`}
                            >
                                {getPriorityLabel((node.data as Card).priority)}
                            </div>
                        )}

                        {isFile && (
                            <span className={styles.fileSize} title="Размер файла">
                                {node.data?.size}
                            </span>
                        )}

                        {renderNodeActions()}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && hasChildren && (
                        <motion.div
                            className={styles.treeChildren}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {node.children!.map(child => (
                                <TreeNode
                                    key={child.id}
                                    node={child}
                                    level={level + 1}
                                    path={[...path, node.name]}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )
    }

    const handleExport = useCallback(() => {
        const exportData = {
            timestamp: new Date().toISOString(),
            totalBoards: boards.length,
            totalCards: boards.reduce((acc, board) => acc + board.cards.length, 0),
            structure: treeData
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

        const exportFileDefaultName = `project-structure-${new Date().toISOString().split('T')[0]}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }, [treeData, boards])

    const projectStats = useMemo(() => {
        const totalCards = boards.reduce((acc, board) => acc + board.cards.length, 0)
        const totalAttachments = boards.reduce((acc, board) =>
            acc + board.cards.reduce((cardAcc, card) => cardAcc + card.attachments, 0), 0
        )
        const completedCards = boards.reduce((acc, board) =>
            acc + board.cards.filter(card => card.status === 'done').length, 0
        )
        const highPriorityCards = boards.reduce((acc, board) =>
            acc + board.cards.filter(card => card.priority === 'high').length, 0
        )

        return {
            totalBoards: boards.length,
            totalCards,
            totalAttachments,
            completedCards,
            completionRate: totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0,
            highPriorityCards
        }
    }, [boards])

    if (!isOpen) return null

    return (
        <motion.div
            className={styles.modalOverlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.treeModal}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <h2 className={styles.modalTitle}>
                            <FaDatabase className={styles.titleIcon} />
                            Древовидная структура проекта
                        </h2>
                        <p className={styles.modalSubtitle}>
                            Интерактивное представление всех задач, файлов и взаимосвязей
                        </p>
                    </div>
                    <div className={styles.modalHeaderActions}>
                        <button
                            className={styles.headerButton}
                            onClick={handleExport}
                            title="Экспорт структуры"
                        >
                            <FaShare />
                            Экспорт
                        </button>
                        <motion.button
                            className={styles.closeButton}
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaTimes />
                        </motion.button>
                    </div>
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.controlsSection}>
                        <div className={styles.searchContainer}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Поиск по названию, тегам, описанию..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className={styles.clearSearch}
                                    onClick={() => setSearchQuery('')}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        <div className={styles.controlButtons}>
                            <div className={styles.filterGroup}>
                                <FaFilter className={styles.controlIcon} />
                                <select
                                    className={styles.filterSelect}
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                >
                                    <option value="all">Все типы</option>
                                    <option value="board">Доски</option>
                                    <option value="card">Задачи</option>
                                    <option value="file">Файлы</option>
                                </select>
                            </div>

                            <div className={styles.sortGroup}>
                                <FaSortAmountDown className={styles.controlIcon} />
                                <select
                                    className={styles.sortSelect}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="name">По имени</option>
                                    <option value="priority">По приоритету</option>
                                    <option value="date">По дате</option>
                                </select>
                            </div>

                            <div className={styles.viewControls}>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => toggleAll(true)}
                                    title="Развернуть все"
                                >
                                    <FaChevronDown />
                                </button>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => toggleAll(false)}
                                    title="Свернуть все"
                                >
                                    <FaChevronRight />
                                </button>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => setShowEmpty(!showEmpty)}
                                    title={showEmpty ? "Скрыть пустые" : "Показать пустые"}
                                >
                                    {showEmpty ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {searchQuery && searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                <span className={styles.resultsCount}>
                                    Найдено: {searchResults.length} совпадений
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.treeContainer}>
                        <div className={styles.treeSection}>
                            <div className={styles.treeHeader}>
                                <div className={styles.treeHeaderLeft}>
                                    <h3 className={styles.treeSectionTitle}>
                                        <FaFolderOpen className={styles.sectionIcon} />
                                        Структура проекта
                                        {isLoading && (
                                            <span className={styles.loadingIndicator}>
                                                Загрузка...
                                            </span>
                                        )}
                                    </h3>
                                    <div className={styles.treeStats}>
                                        <span className={styles.statItem}>
                                            <FaDatabase />
                                            {boards.length} досок
                                        </span>
                                        <span className={styles.statItem}>
                                            <FaTag />
                                            {projectStats.totalCards} задач
                                        </span>
                                        <span className={styles.statItem}>
                                            <FaPaperclip />
                                            {projectStats.totalAttachments} файлов
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.treeWrapper}>
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            className={styles.loadingContainer}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={styles.skeletonNode} />
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="tree"
                                            className={styles.tree}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {filteredTreeData.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                    <FaDatabase className={styles.emptyIcon} />
                                                    <h4>Нет данных для отображения</h4>
                                                    <p>Данные проекта не найдены</p>
                                                </div>
                                            ) : (
                                                filteredTreeData.map(node => (
                                                    <TreeNode key={node.id} node={node} />
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className={styles.detailsSection}>
                            <div className={styles.detailsHeader}>
                                <h3 className={styles.detailsTitle}>
                                    <FaChartBar className={styles.sectionIcon} />
                                    {selectedNode ? 'Детали' : 'Обзор проекта'}
                                </h3>
                                {selectedNode && (
                                    <button
                                        className={styles.externalLink}
                                        onClick={() => {
                                        }}
                                    >
                                        <FaExternalLinkAlt />
                                    </button>
                                )}
                            </div>

                            <div className={styles.detailsContent}>
                                {selectedNode ? (
                                    <div className={styles.nodeDetails}>
                                        <div className={styles.nodeHeader}>
                                            <div className={styles.nodeIconLarge}>
                                                {selectedNode.type === 'board' ? (
                                                    <div
                                                        className={styles.boardIconLarge}
                                                        style={{ backgroundColor: (selectedNode.data as Board)?.color }}
                                                    />
                                                ) : selectedNode.type === 'card' ? (
                                                    <FaFolderOpen className={styles.cardIconLarge} />
                                                ) : selectedNode.type === 'file' ? (
                                                    getFileIcon(selectedNode.data?.type)
                                                ) : (
                                                    <FaFolderOpen className={styles.folderIconLarge} />
                                                )}
                                            </div>
                                            <div className={styles.nodeInfo}>
                                                <h4 className={styles.nodeTitle}>{selectedNode.name}</h4>
                                                <span className={styles.nodeType}>
                                                    Тип: {selectedNode.type === 'board' ? 'Доска' :
                                                    selectedNode.type === 'card' ? 'Задача' :
                                                        selectedNode.type === 'file' ? 'Файл' : 'Папка'}
                                                </span>
                                                {selectedNode.data?.createdAt && (
                                                    <span className={styles.nodeDate}>
                                                        Создано: {new Date(selectedNode.data.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {selectedNode.type === 'card' && selectedNode.data && (
                                            <div className={styles.cardDetails}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Приоритет:</span>
                                                    <div className={styles.detailValue}>
                                                        <div
                                                            className={styles.priorityIndicator}
                                                            style={{ backgroundColor: getPriorityColor(selectedNode.data.priority) }}
                                                        />
                                                        {getPriorityLabel(selectedNode.data.priority)}
                                                    </div>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Статус:</span>
                                                    <div className={styles.detailValue}>
                                                        {getStatusIcon(selectedNode.data.status)}
                                                        {selectedNode.data.status === 'done' ? 'Завершено' :
                                                            selectedNode.data.status === 'in-progress' ? 'В работе' :
                                                                selectedNode.data.status === 'review' ? 'На проверке' : 'К выполнению'}
                                                    </div>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Прогресс:</span>
                                                    <div className={styles.progressBar}>
                                                        <div
                                                            className={styles.progressFill}
                                                            style={{ width: `${selectedNode.data.progress}%` }}
                                                        />
                                                        <span className={styles.progressText}>
                                                            {selectedNode.data.progress}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Теги:</span>
                                                    <div className={styles.tagsContainer}>
                                                        {selectedNode.data.tags?.map((tag: string, index: number) => (
                                                            <span key={index} className={styles.tag}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'file' && selectedNode.data && (
                                            <div className={styles.fileDetails}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Размер:</span>
                                                    <span className={styles.detailValue}>{selectedNode.data.size}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Загружено:</span>
                                                    <span className={styles.detailValue}>{selectedNode.data.uploadedAt}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>Автор:</span>
                                                    <span className={styles.detailValue}>{selectedNode.data.uploadedBy}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.projectOverview}>
                                        <div className={styles.overviewStats}>
                                            <div className={styles.statCard}>
                                                <FaDatabase className={styles.statIcon} />
                                                <div className={styles.statContent}>
                                                    <span className={styles.statNumber}>{projectStats.totalBoards}</span>
                                                    <span className={styles.statLabel}>Досок</span>
                                                </div>
                                            </div>
                                            <div className={styles.statCard}>
                                                <FaTag className={styles.statIcon} />
                                                <div className={styles.statContent}>
                                                    <span className={styles.statNumber}>{projectStats.totalCards}</span>
                                                    <span className={styles.statLabel}>Задач</span>
                                                </div>
                                            </div>
                                            <div className={styles.statCard}>
                                                <FaCheckCircle className={styles.statIcon} style={{ color: '#10b981' }} />
                                                <div className={styles.statContent}>
                                                    <span className={styles.statNumber}>{projectStats.completionRate}%</span>
                                                    <span className={styles.statLabel}>Завершено</span>
                                                </div>
                                            </div>
                                            <div className={styles.statCard}>
                                                <FaExclamationTriangle className={styles.statIcon} style={{ color: '#ef4444' }} />
                                                <div className={styles.statContent}>
                                                    <span className={styles.statNumber}>{projectStats.highPriorityCards}</span>
                                                    <span className={styles.statLabel}>Высокий приоритет</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.teamSection}>
                                            <h4 className={styles.sectionSubtitle}>
                                                <FaUsers className={styles.subsectionIcon} />
                                                Команда проекта
                                            </h4>
                                            <div className={styles.teamGrid}>
                                                {[
                                                    { id: 1, name: 'Алексей Петров', role: 'Team Lead', avatar: null },
                                                    { id: 2, name: 'Мария Иванова', role: 'Backend Developer', avatar: null },
                                                    { id: 3, name: 'Иван Сидоров', role: 'DevOps', avatar: null },
                                                    { id: 4, name: 'Елена Козлова', role: 'QA Engineer', avatar: null },
                                                    { id: 5, name: 'Дмитрий Смирнов', role: 'Frontend Developer', avatar: null },
                                                    { id: 6, name: 'Ольга Новикова', role: 'UI/UX Designer', avatar: null }
                                                ].map(member => (
                                                    <div key={member.id} className={styles.teamMember}>
                                                        <div className={styles.memberAvatar}>
                                                            {member.avatar ? (
                                                                <img src={member.avatar} alt={member.name} />
                                                            ) : (
                                                                <FaUserCircle />
                                                            )}
                                                        </div>
                                                        <div className={styles.memberInfo}>
                                                            <span className={styles.memberName}>{member.name}</span>
                                                            <span className={styles.memberRole}>{member.role}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default TreeViewModal