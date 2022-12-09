import { useCallback, useEffect, useRef } from 'react'

export const useRaf = (callback: (fps: number) => void) => {
  const rafId = useRef(0)
  const prevTime = useRef(0)

  const run = useCallback(() => {
    const time = performance.now()
    const timeDiff = time - prevTime.current
    prevTime.current = time

    callback(Math.floor(1e3 / timeDiff))

    rafId.current = window.requestAnimationFrame(run)
  }, [callback])

  useEffect(() => {
    rafId.current = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(rafId.current)
  }, [run])
}
