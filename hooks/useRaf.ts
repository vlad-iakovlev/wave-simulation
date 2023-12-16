import React from 'react'

export const useRaf = (callback: () => void) => {
  const rafId = React.useRef(0)

  React.useEffect(() => {
    const run = () => {
      callback()
      rafId.current = window.requestAnimationFrame(run)
    }

    rafId.current = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(rafId.current)
  }, [callback])
}
