import { useEffect, useRef } from 'react'

export const useRaf = (callback: () => void) => {
  const rafId = useRef(0)

  useEffect(() => {
    const run = () => {
      callback()
      rafId.current = window.requestAnimationFrame(run)
    }

    rafId.current = window.requestAnimationFrame(run)
    return () => {
      window.cancelAnimationFrame(rafId.current)
    }
  }, [callback])
}
