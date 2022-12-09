import { useCallback, useEffect, useRef } from 'react'

export const useResize = (callback: () => void) => {
  const width = useRef(0)
  const height = useRef(0)

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    // iOS scroll triggers resize, ignore it
    if (width.current === newWidth && height.current === newHeight) return

    width.current = newWidth
    height.current = newHeight

    callback()
  }, [callback])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])
}
