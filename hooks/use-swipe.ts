'use client'

import { useCallback, useRef } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeOptions): SwipeHandlers {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
    touchEnd.current = null
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    touchEnd.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const onTouchEnd = useCallback(
    () => {
      if (!touchStart.current || !touchEnd.current) return

      const deltaX = touchEnd.current.x - touchStart.current.x
      const deltaY = touchEnd.current.y - touchStart.current.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (absDeltaX > threshold && absDeltaY < threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else if (absDeltaY > threshold && absDeltaX < threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }

      touchStart.current = null
      touchEnd.current = null
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold],
  )

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
