import { useState, useRef, useCallback } from 'react'

export function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(0)

  const start = useCallback(() => {
    if (!intervalRef.current) {
      startTimeRef.current = Date.now() - elapsedTime
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current)
      }, 10)
      setIsRunning(true)
      setIsPaused(false)
    }
  }, [elapsedTime])

  const pause = useCallback(() => {
    if (intervalRef.current && !isPaused) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsPaused(true)
    } else if (isPaused) {
      startTimeRef.current = Date.now() - elapsedTime
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current)
      }, 10)
      setIsPaused(false)
    }
  }, [isPaused, elapsedTime])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    return elapsedTime
  }, [elapsedTime])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsedTime(0)
    setIsRunning(false)
    setIsPaused(false)
  }, [])

  const formatTime = useCallback((ms = elapsedTime) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [elapsedTime])

  const getMinutes = useCallback((ms = elapsedTime) => {
    return parseFloat((ms / 60000).toFixed(2))
  }, [elapsedTime])

  const getFormattedResolution = useCallback((ms = elapsedTime) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes} min ${seconds} seg (${(ms / 60000).toFixed(2)} minutos)`
  }, [elapsedTime])

  return {
    elapsedTime,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset,
    formatTime,
    getMinutes,
    getFormattedResolution
  }
}
