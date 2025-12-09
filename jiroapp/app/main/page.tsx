'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState, lazy, Suspense } from 'react'
import VerticalNavbar from '../components/VerticalNavbar/VerticalNavbar'
import ControlPanel from '../components/ControlPanel/ControlPanel'
import styles from './MainPage.module.css'
import BoardsContent from '../components/BoardsContent/BoardsContent'
import { Project } from '../components/VerticalNavbar/CreateProject/types/types'

const DashboardContent = lazy(() => import('../components/DashboardContent/DashboardContent'))
const DevelopersPage = lazy(() => import('../components/DevelopersContent/DevelopersPage'))
const ReportsPage = lazy(() => import('../components/ReportsContent/ReportsPage'))
const SettingsContent = lazy(() => import('../components/SettingsContent/SettingsContent'))
const ProjectContent = lazy(() => import('../components/ProjectContent/ProjectContent'))

type ActivePage = 'dashboard' | 'board' | 'developers' | 'settings' | 'reports' | 'project'

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
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(false)
    const [loadedComponents, setLoadedComponents] = useState<Set<ActivePage>>(new Set(['board']))
    const [activeProject, setActiveProject] = useState<Project | null>(null)
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

        if (page !== 'board' && page !== 'project') {
            setIsControlPanelOpen(true)
        }
    }

    const handleProjectSelect = (project: Project) => {
        if (activeProject?.id !== project.id) {
            setActiveProject(project)
            setActivePage('project')
            setIsControlPanelOpen(true)
        } else {
            setActivePage('project')
            setIsControlPanelOpen(true)
        }
    }

    const handleBackToDashboard = () => {
        setActiveProject(null)
        setActivePage('board')
        setIsControlPanelOpen(false)
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
                {activePage === 'project' && activeProject && (
                    <ProjectContent
                        project={activeProject}
                        onBackToDashboard={handleBackToDashboard}
                        key={activeProject.id}
                    />
                )}
            </Suspense>
        )
    }

    return (
        <div className={styles.mainContainer}>
            <VerticalNavbar
                onToggleControlPanel={handleToggleControlPanel}
                isControlPanelOpen={isControlPanelOpen}
                onProjectSelect={handleProjectSelect}
                activeProjectId={activeProject?.id || null}
            />
            <ControlPanel
                activePage={activePage}
                onPageChange={handlePageChange}
                isOpen={isControlPanelOpen}
                hasActiveProject={!!activeProject}
                onBackToProjects={handleBackToDashboard}
                showFullMenu={!!activeProject}
            />

            <div className={`${styles.mainContentWrapper} ${!isControlPanelOpen ? styles.panelCollapsed : ''}`}>
                {renderContent()}
            </div>
        </div>
    )
}

export default MainPage