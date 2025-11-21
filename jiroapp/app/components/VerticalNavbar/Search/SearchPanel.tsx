'use client'

import { useState } from 'react'
import { FaSearch, FaTimes, FaLink, FaCopy } from 'react-icons/fa'
import styles from './SearchPanel.module.css'

interface SearchPanelProps {
    onClose: () => void
}

const SearchPanel = ({ onClose }: SearchPanelProps) => {
    const [inviteLink, setInviteLink] = useState('')
    const [isValidLink, setIsValidLink] = useState(true)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        // Проверяем, соответствует ли ссылка формату приглашения
        const isValid = validateInviteLink(inviteLink)
        setIsValidLink(isValid)

        if (isValid) {
            console.log('Пригласительная ссылка:', inviteLink)
            // Здесь будет логика поиска проекта по ссылке
            // Например, извлечение кода из ссылки и запрос к API
            const inviteCode = extractInviteCode(inviteLink)
            console.log('Код приглашения:', inviteCode)
        }
    }

    const validateInviteLink = (link: string): boolean => {
        // Проверяем формат пригласительной ссылки
        const inviteRegex = /^https:\/\/taskflow\.ru\/invite\/[a-zA-Z0-9-]+$/
        return inviteRegex.test(link.trim())
    }

    const extractInviteCode = (link: string): string => {
        const parts = link.split('/')
        return parts[parts.length - 1]
    }

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInviteLink(text)
            setIsValidLink(validateInviteLink(text))
        } catch (error) {
            console.error('Ошибка при чтении из буфера обмена:', error)
        }
    }

    const quickExamples = [
        'https://taskflow.ru/invite/abc123-def456-ghi789'
    ]

    return (
        <div className={styles.panelOverlay} onClick={onClose}>
            <div className={styles.searchPanel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.searchHeader}>
                    <div className={`${styles.searchInputWrapper} ${!isValidLink && inviteLink ? styles.invalid : ''}`}>
                        <FaLink className={styles.searchIcon} />
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Введите пригласительную ссылку..."
                                value={inviteLink}
                                onChange={(e) => {
                                    setInviteLink(e.target.value)
                                    if (e.target.value) {
                                        setIsValidLink(validateInviteLink(e.target.value))
                                    } else {
                                        setIsValidLink(true)
                                    }
                                }}
                                className={styles.searchInput}
                                autoFocus
                            />
                        </form>
                        <button
                            type="button"
                            className={styles.pasteButton}
                            onClick={handlePasteFromClipboard}
                            title="Вставить из буфера обмена"
                        >
                            <FaCopy className={styles.pasteIcon} />
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            <FaTimes className={styles.closeIcon} />
                        </button>
                    </div>
                    {!isValidLink && inviteLink && (
                        <div className={styles.errorMessage}>
                            Неверный формат ссылки. Пример: https://taskflow.ru/invite/abc123-def456-ghi789
                        </div>
                    )}
                </div>

                {inviteLink === '' && (
                    <div className={styles.quickSearches}>
                        <div className={styles.quickTitle}>Примеры пригласительных ссылок</div>
                        <div className={styles.examplesList}>
                            {quickExamples.map((example, index) => (
                                <button
                                    key={index}
                                    className={styles.exampleLink}
                                    onClick={() => setInviteLink(example)}
                                >
                                    <FaLink className={styles.linkIcon} />
                                    <span className={styles.linkText}>{example}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {inviteLink && isValidLink && (
                    <div className={styles.searchHint}>
                        Нажмите Enter для присоединения к проекту
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPanel