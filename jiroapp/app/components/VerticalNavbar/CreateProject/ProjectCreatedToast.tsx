import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import styles from './ProjectCreatedToast.module.css';

interface ProjectCreatedToastProps {
    projectName: string;
}

export default function ProjectCreatedToast({ projectName }: ProjectCreatedToastProps) {
    return (
        <motion.div
            className={styles.toastContainer}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
        >
            <div className={styles.toastContent}>
                <div className={styles.successIcon}>
                    <FaCheck />
                </div>
                <div className={styles.message}>
                    <span className={styles.projectName}>{projectName}</span>
                    <span className={styles.successText}> создан</span>
                </div>
            </div>
        </motion.div>
    );
}