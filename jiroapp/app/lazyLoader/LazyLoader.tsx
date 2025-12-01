'use client'

import React, { Suspense } from 'react'

interface LazyLoaderProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

const LazyLoader = ({
                        children,
                        fallback = (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '300px',
                                marginTop: '4rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3d6bb3',
                                        animation: 'pulse 1.4s ease-in-out infinite both'
                                    }}></div>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3d6bb3',
                                        animation: 'pulse 1.4s ease-in-out 0.2s infinite both'
                                    }}></div>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3d6bb3',
                                        animation: 'pulse 1.4s ease-in-out 0.4s infinite both'
                                    }}></div>
                                </div>
                                <p style={{
                                    color: '#666',
                                    fontSize: '18px',
                                    fontWeight: '500'
                                }}>Загрузка...</p>
                            </div>
                        )
                    }: LazyLoaderProps) => {
    return <Suspense fallback={fallback}>{children}</Suspense>
}

export default LazyLoader