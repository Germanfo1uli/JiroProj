'use client'

import { useState } from 'react'
import VerticalNavbar from '../components/VerticalNavbar/VerticalNavbar'
import ControlPanel from '../components/ControlPanel/ControlPanel'
import BoardsContent from '../components/BoardsContent/BoardsContent'
import { DashboardContent } from '@/app/components/DashboardContent'
import { DevelopersPage } from '@/app/components/DevelopersContent'
import SettingsContent from '../components/SettingsContent/SettingsContent'
import styles from './MainPage.module.css'

type ActivePage = 'dashboard' | 'board' | 'developers' | 'settings' // Добавляем 'settings'

const MainPage = () => {
    const [activePage, setActivePage] = useState<ActivePage>('board')

    const handlePageChange = (page: ActivePage) => {
        setActivePage(page)
    }

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardContent />
            case 'board':
                return <BoardsContent />
            case 'developers':
                return <DevelopersPage />
            case 'settings': // Добавляем case для настроек
                return <SettingsContent onBackClick={() => setActivePage('board')} />
            default:
                return <BoardsContent />
        }
    }

    return (
        <div className={styles.mainContainer}>
            <VerticalNavbar />
            <ControlPanel
                activePage={activePage}
                onPageChange={handlePageChange}
            />

            <div className={styles.mainContentWrapper}>
                {renderContent()}
            </div>
        </div>
    )
}

export default MainPage