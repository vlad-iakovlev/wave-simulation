import React from 'react'

export const useFullscreenOnSpace = (ref: React.RefObject<HTMLElement>) => {
  const toggle = React.useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void ref.current?.requestFullscreen()
    }
  }, [ref])

  const handleKeydown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    },
    [toggle],
  )

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])
}
