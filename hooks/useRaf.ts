import { useCallback, useEffect, useRef } from 'react'

export const useRaf = (callback: () => void) => {
  const rafId = useRef(0)

  const run = useCallback(() => {
    callback()
    rafId.current = window.requestAnimationFrame(run)
  }, [callback])

  useEffect(() => {
    rafId.current = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(rafId.current)
  }, [run])
}
