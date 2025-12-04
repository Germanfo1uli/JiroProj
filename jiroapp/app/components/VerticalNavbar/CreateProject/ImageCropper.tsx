

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {AnimatePresence, motion } from 'framer-motion'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { CropArea } from './types/types'
import styles from './ImageCropper.module.css'

interface ImageCropperProps {
    imageUrl: string;
    onCropChange: (crop: CropArea) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const MIN_CROP_SIZE = 80
const ASPECT_RATIO = 1

export default function ImageCropper({ imageUrl, onCropChange, onConfirm, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setContainerSize({ width: rect.width, height: rect.height })
            }
        }

        updateContainerSize()
        window.addEventListener('resize', updateContainerSize)

        return () => window.removeEventListener('resize', updateContainerSize)
    }, [])

    useEffect(() => {
        if (imageRef.current) {
            const img = imageRef.current
            img.onload = () => {
                const naturalWidth = img.naturalWidth
                const naturalHeight = img.naturalHeight
                setImageSize({ width: naturalWidth, height: naturalHeight })

                const container = containerRef.current
                if (container) {
                    const containerWidth = container.clientWidth
                    const containerHeight = container.clientHeight

                    const scale = Math.min(
                        containerWidth / naturalWidth,
                        containerHeight / naturalHeight,
                        1
                    )

                    const displayedWidth = naturalWidth * scale
                    const displayedHeight = naturalHeight * scale

                    const cropSize = Math.min(displayedWidth, displayedHeight, 200)
                    const x = (displayedWidth - cropSize) / 2
                    const y = (displayedHeight - cropSize) / 2

                    const newCrop = {
                        x: Math.max(0, x),
                        y: Math.max(0, y),
                        width: cropSize,
                        height: cropSize
                    }
                    setCrop(newCrop)
                    onCropChange(getRealCropCoordinates(newCrop))
                }
            }
        }
    }, [imageUrl, onCropChange])

    const getImageDisplaySize = useCallback(() => {
        if (!imageSize.width || !imageSize.height || !containerRef.current) {
            return { width: 0, height: 0 }
        }

        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        const scale = Math.min(
            containerWidth / imageSize.width,
            containerHeight / imageSize.height,
            1
        )

        return {
            width: imageSize.width * scale,
            height: imageSize.height * scale
        }
    }, [imageSize])

    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const mouseX = clientX - rect.left
        const mouseY = clientY - rect.top

        if (mouseX >= crop.x && mouseX <= crop.x + crop.width &&
            mouseY >= crop.y && mouseY <= crop.y + crop.height) {
            setIsDragging(true)
            setDragStart({
                x: mouseX - crop.x,
                y: mouseY - crop.y
            })
        }
    }, [crop])

    const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return

        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const mouseX = clientX - rect.left
        const mouseY = clientY - rect.top

        const displaySize = getImageDisplaySize()

        let newX = mouseX - dragStart.x
        let newY = mouseY - dragStart.y

        newX = Math.max(0, Math.min(newX, displaySize.width - crop.width))
        newY = Math.max(0, Math.min(newY, displaySize.height - crop.height))

        const newCrop = { ...crop, x: newX, y: newY }
        setCrop(newCrop)
        onCropChange(getRealCropCoordinates(newCrop))
    }, [isDragging, dragStart, crop, getImageDisplaySize, onCropChange])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleResize = useCallback((e: React.MouseEvent | React.TouchEvent, corner: string) => {
        e.preventDefault()
        e.stopPropagation()

        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const startY = 'touches' in e ? e.touches[0].clientY : e.clientY
        const startCrop = { ...crop }
        const displaySize = getImageDisplaySize()

        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
            const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY

            const deltaX = clientX - startX
            const deltaY = clientY - startY

            let newCrop = { ...startCrop }

            switch (corner) {
                case 'bottom-right':
                    newCrop.width = Math.max(MIN_CROP_SIZE, startCrop.width + deltaX)
                    newCrop.height = newCrop.width
                    break
                case 'bottom-left':
                    newCrop.x = startCrop.x + deltaX
                    newCrop.width = Math.max(MIN_CROP_SIZE, startCrop.width - deltaX)
                    newCrop.height = newCrop.width
                    break
                case 'top-right':
                    newCrop.y = startCrop.y + deltaY
                    newCrop.width = Math.max(MIN_CROP_SIZE, startCrop.width + deltaX)
                    newCrop.height = newCrop.width
                    break
                case 'top-left':
                    newCrop.x = startCrop.x + deltaX
                    newCrop.y = startCrop.y + deltaY
                    newCrop.width = Math.max(MIN_CROP_SIZE, startCrop.width - deltaX)
                    newCrop.height = newCrop.width
                    break
            }

            newCrop.width = Math.min(newCrop.width, displaySize.width - newCrop.x)
            newCrop.height = Math.min(newCrop.height, displaySize.height - newCrop.y)

            const size = Math.min(newCrop.width, newCrop.height)
            newCrop.width = size
            newCrop.height = size

            if (newCrop.x + newCrop.width > displaySize.width) {
                newCrop.x = displaySize.width - newCrop.width
            }
            if (newCrop.y + newCrop.height > displaySize.height) {
                newCrop.y = displaySize.height - newCrop.height
            }
            newCrop.x = Math.max(0, newCrop.x)
            newCrop.y = Math.max(0, newCrop.y)

            setCrop(newCrop)
            onCropChange(getRealCropCoordinates(newCrop))
        }

        const handleUp = () => {
            document.removeEventListener('mousemove', handleMove as any)
            document.removeEventListener('mouseup', handleUp)
            document.removeEventListener('touchmove', handleMove as any)
            document.removeEventListener('touchend', handleUp)
        }

        document.addEventListener('mousemove', handleMove as any)
        document.addEventListener('mouseup', handleUp)
        document.addEventListener('touchmove', handleMove as any, { passive: false })
        document.addEventListener('touchend', handleUp)
    }, [crop, getImageDisplaySize, onCropChange])

    const getRealCropCoordinates = useCallback((displayCrop: CropArea) => {
        const displaySize = getImageDisplaySize()

        if (!displaySize.width || !displaySize.height || !imageSize.width || !imageSize.height) {
            return displayCrop
        }

        const scaleX = imageSize.width / displaySize.width
        const scaleY = imageSize.height / displaySize.height

        return {
            x: displayCrop.x * scaleX,
            y: displayCrop.y * scaleY,
            width: displayCrop.width * scaleX,
            height: displayCrop.height * scaleY
        }
    }, [imageSize, getImageDisplaySize])

    const displaySize = getImageDisplaySize()

    return (
        <motion.div
            className={styles.cropperContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
            <motion.div
                className={styles.cropperHeader}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3>Выберите область для обложки</h3>
                <p>Перетащите и измените размер выделенной области</p>
            </motion.div>

            <div
                ref={containerRef}
                className={styles.imageContainer}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Изображение для обрезки"
                    className={styles.cropImage}
                    style={{
                        width: `${displaySize.width}px`,
                        height: `${displaySize.height}px`
                    }}
                    draggable={false}
                />

                <AnimatePresence>
                    {displaySize.width > 0 && displaySize.height > 0 && (
                        <motion.div
                            className={styles.cropArea}
                            style={{
                                left: `${crop.x}px`,
                                top: `${crop.y}px`,
                                width: `${crop.width}px`,
                                height: `${crop.height}px`,
                            }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                            <div className={styles.cropGrid}>
                                <div className={styles.gridLine} style={{ top: '33%' }} />
                                <div className={styles.gridLine} style={{ top: '66%' }} />
                                <div className={styles.gridLine} style={{ left: '33%' }} />
                                <div className={styles.gridLine} style={{ left: '66%' }} />
                            </div>

                            <motion.div
                                className={`${styles.resizeHandle} ${styles.topLeft}`}
                                onMouseDown={(e) => handleResize(e, 'top-left')}
                                onTouchStart={(e) => handleResize(e, 'top-left')}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Сжать слева сверху"
                            />
                            <motion.div
                                className={`${styles.resizeHandle} ${styles.topRight}`}
                                onMouseDown={(e) => handleResize(e, 'top-right')}
                                onTouchStart={(e) => handleResize(e, 'top-right')}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Сжать справа сверху"
                            />
                            <motion.div
                                className={`${styles.resizeHandle} ${styles.bottomLeft}`}
                                onMouseDown={(e) => handleResize(e, 'bottom-left')}
                                onTouchStart={(e) => handleResize(e, 'bottom-left')}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Сжать слева снизу"
                            />
                            <motion.div
                                className={`${styles.resizeHandle} ${styles.bottomRight}`}
                                onMouseDown={(e) => handleResize(e, 'bottom-right')}
                                onTouchStart={(e) => handleResize(e, 'bottom-right')}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Сжать справа снизу"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className={styles.cropperActions}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.button
                    className={styles.cancelButton}
                    onClick={onCancel}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FaTimes /> Отмена
                </motion.button>
                <motion.button
                    className={styles.confirmButton}
                    onClick={onConfirm}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FaCheck /> Применить
                </motion.button>
            </motion.div>
        </motion.div>
    )
}