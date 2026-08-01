import { useEffect, useRef } from 'react'

export const useRaf = (callback: () => void) => {
  const rafIdRef = useRef(0)

  useEffect(() => {
    const run = () => {
      callback()
      rafIdRef.current = window.requestAnimationFrame(run)
    }

    rafIdRef.current = window.requestAnimationFrame(run)
    return () => {
      window.cancelAnimationFrame(rafIdRef.current)
    }
  }, [callback])
}
