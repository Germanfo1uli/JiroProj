'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState, lazy, Suspense } from 'react'
import VerticalNavbar from '../components/VerticalNavbar/VerticalNavbar'
import ControlPanel from '../components/ControlPanel/ControlPanel'
import styles from './MainPage.module.css'
import BoardsContent from '../components/BoardsContent/BoardsContent'

const DashboardContent = lazy(() => import('../components/DashboardContent/DashboardContent'))
const DevelopersPage = lazy(() => import('../components/DevelopersContent/DevelopersPage'))
const ReportsPage = lazy(() => import('../components/ReportsContent/ReportsPage'))
const SettingsContent = lazy(() => import('../components/SettingsContent/SettingsContent'))

type ActivePage = 'dashboard' | 'board' | 'developers' | 'settings' | 'reports'

// Улучшенный компонент для загрузки
const LoadingFallback = () => (
    <div className={styles.loadingFallback}>
        <div className={styles.loadingContainer}>
            <div className={styles.pulseLoader}>
                <div className={styles.pulseDot}></div>
                <div className={styles.pulseDot}></div>
                <div className={styles.pulseDot}></div>
            </div>
            <p className={styles.loadingText}>Загружаем контент...</p>
        </div>
    </div>
)

const MainPage = () => {
    const [activePage, setActivePage] = useState<ActivePage>('board')
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(true)
    const [loadedComponents, setLoadedComponents] = useState<Set<ActivePage>>(new Set(['board']))
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/welcome')
        }
    }, [router])

    const handlePageChange = (page: ActivePage) => {
        setLoadedComponents(prev => new Set([...prev, page]))
        setActivePage(page)
    }

    const handleToggleControlPanel = () => {
        setIsControlPanelOpen(!isControlPanelOpen)
    }

    const renderContent = () => {
        return (
            <Suspense fallback={<LoadingFallback />}>
                {activePage === 'dashboard' && <DashboardContent />}
                {activePage === 'board' && <BoardsContent />}
                {activePage === 'developers' && <DevelopersPage />}
                {activePage === 'reports' && <ReportsPage />}
                {activePage === 'settings' && <SettingsContent onBackClick={() => setActivePage('board')} />}
            </Suspense>
        )
    }

    return (
        <div className={styles.mainContainer}>
            <VerticalNavbar
                onToggleControlPanel={handleToggleControlPanel}
                isControlPanelOpen={isControlPanelOpen}
            />
            <ControlPanel
                activePage={activePage}
                onPageChange={handlePageChange}
                isOpen={isControlPanelOpen}
            />

            <div className={`${styles.mainContentWrapper} ${!isControlPanelOpen ? styles.panelCollapsed : ''}`}>
                {renderContent()}
            </div>
        </div>
    )
}

export default MainPage