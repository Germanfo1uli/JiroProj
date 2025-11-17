import { useDashboard } from '../../DashboardContent/hooks/useDashboard';
import { Developer } from '../types/developer.types';
import { useEffect, useState } from 'react';

export const useDeveloperProjects = () => {
    const { boards } = useDashboard();
    const [projectCache, setProjectCache] = useState<Map<string, string[]>>(new Map());

    const getDeveloperProjects = (developer: Developer): string[] => {
        const cacheKey = developer.name;

        if (projectCache.has(cacheKey)) {
            return projectCache.get(cacheKey) || [];
        }
        const userProjects = new Set<string>();

        boards.forEach(board => {
            board.cards?.forEach(card => {
                if (card.author.name === developer.name) {
                    card.tags?.forEach(tag => {
                        if (tag && tag.length > 0 && !tag.toLowerCase().includes('настройка')) {
                            userProjects.add(tag);
                        }
                    });

                    if (board.title &&
                        !['To Do', 'In Progress', 'Review', 'Done'].includes(board.title) &&
                        !userProjects.has(board.title)) {
                        userProjects.add(board.title);
                    }

                    const descriptionKeywords = extractProjectsFromDescription(card.description);
                    descriptionKeywords.forEach(keyword => {
                        if (keyword && keyword.length > 0) {
                            userProjects.add(keyword);
                        }
                    });
                }
            });
        });

        let projects: string[];
        if (userProjects.size === 0) {
            projects = developer.projects && developer.projects.length > 0
                ? developer.projects
                : ['TASKFLOW PRO'];
        } else {
            projects = Array.from(userProjects);
        }

        setProjectCache(prev => new Map(prev.set(cacheKey, projects)));

        return projects;
    };

    const extractProjectsFromDescription = (description: string): string[] => {
        const projects = new Set<string>();
        const keywords = [
            'TASKFLOW', 'API', 'Frontend', 'Backend', 'Database', 'Mobile',
            'Design', 'Testing', 'DevOps', 'Security', 'Analytics'
        ];

        keywords.forEach(keyword => {
            if (description.toLowerCase().includes(keyword.toLowerCase())) {
                projects.add(keyword);
            }
        });

        return Array.from(projects);
    };

    const getAllUniqueProjects = (developers: Developer[]): string[] => {
        const allProjects = new Set<string>();

        developers.forEach(developer => {
            const developerProjects = getDeveloperProjects(developer);
            developerProjects.forEach(project => {
                if (project && project.length > 0) {
                    allProjects.add(project);
                }
            });
        });

        boards.forEach(board => {
            board.cards?.forEach(card => {
                card.tags?.forEach(tag => {
                    if (tag && tag.length > 0) {
                        allProjects.add(tag);
                    }
                });
            });
        });

        return Array.from(allProjects).sort();
    };


    useEffect(() => {
        setProjectCache(new Map());
    }, [boards]);

    return {
        getDeveloperProjects,
        getAllUniqueProjects
    };
};