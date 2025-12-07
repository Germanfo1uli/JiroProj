'use client'

import { useState, useRef, useEffect } from 'react'
import { FaEllipsisH, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import styles from './CardMenu.module.css'

interface CardMenuProps {
    onEdit: () => void
    onDelete: () => void
    onClose: () => void
}

const CardMenu = ({ onEdit, onDelete, onClose }: CardMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - triggerRect.bottom
            const spaceAbove = triggerRect.top

            setPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom')
        }
    }, [isOpen])

    const handleEdit = () => {
        onEdit()
        setIsOpen(false)
    }

    const handleDelete = () => {
        onDelete()
        setIsOpen(false)
    }

    return (
        <div className={styles.cardMenuContainer} ref={menuRef}>
            <button
                ref={triggerRef}
                className={styles.menuTrigger}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
            >
                <FaEllipsisH />
            </button>

            {isOpen && (
                <div
                    className={`${styles.menuDropdown} ${position === 'top' ? styles.menuTop : styles.menuBottom}`}
                    style={{
                        [position === 'top' ? 'bottom' : 'top']: position === 'top' ? '100%' : '100%',
                        right: 0
                    }}
                >
                    <div className={styles.menuHeader}>
                        <span className={styles.menuTitle}>Действия с карточкой</span>
                        <button
                            className={styles.closeMenuButton}
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className={styles.menuItems}>
                        <button
                            className={styles.menuItem}
                            onClick={handleEdit}
                        >
                            <FaEdit className={styles.menuItemIcon} />
                            <span>Редактировать</span>
                        </button>

                        <button
                            className={`${styles.menuItem} ${styles.deleteItem}`}
                            onClick={handleDelete}
                        >
                            <FaTrash className={styles.menuItemIcon} />
                            <span>Удалить</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CardMenu