import { RefObject, useCallback, useEffect, useState } from 'react'

export const useFullscreenOnSpace = (ref: RefObject<HTMLElement>) => {
  const [active, setActive] = useState(false)

  const toggle = useCallback(() => {
    if (active) {
      document.exitFullscreen()
    } else {
      ref.current?.requestFullscreen()
    }
  }, [active, ref])

  const handleFullscreenChange = useCallback(() => {
    setActive(Boolean(document.fullscreenElement))
  }, [])

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    },
    [toggle]
  )

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleFullscreenChange, handleKeydown])
}
