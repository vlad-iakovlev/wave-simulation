import React from 'react'

export const useRaf = (callback: () => void) => {
  const rafId = React.useRef(0)

  const run = React.useCallback(() => {
    callback()
    rafId.current = window.requestAnimationFrame(run)
  }, [callback])

  React.useEffect(() => {
    rafId.current = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(rafId.current)
  }, [run])
}
