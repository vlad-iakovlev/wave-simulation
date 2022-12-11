import { RefObject, useCallback, useEffect } from 'react'

export const useFullscreenOnSpace = (ref: RefObject<HTMLElement>) => {
  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      ref.current?.requestFullscreen()
    }
  }, [ref])

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
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])
}
