'use client'

import VerticalNavbar from '../components/VerticalNavbar/VerticalNavbar'
import ControlPanel from '../components/ControlPanel/ControlPanel'
import BoardsContent from '../components/BoardsContent/BoardsContent'
import styles from './MainPage.module.css'

const MainPage = () => {
    return (
        <div className={styles.mainContainer}>
            <VerticalNavbar />
            <ControlPanel />

            <div className={styles.mainContentWrapper}>
                <BoardsContent />
            </div>
        </div>
    )
}

export default MainPage