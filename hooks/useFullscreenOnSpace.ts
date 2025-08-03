import React from 'react'

export const useFullscreenOnSpace = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()

        if (document.fullscreenElement) {
          void document.exitFullscreen()
        } else {
          void ref.current?.requestFullscreen()
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [ref])
}
