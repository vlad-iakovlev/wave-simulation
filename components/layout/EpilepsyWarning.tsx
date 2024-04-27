'use client'

import React from 'react'

const LS_KEY = 'isEpilepsyWarningAccepted'

export const EpilepsyWarning = () => {
  const [isAccepted, setIsAccepted] = React.useState(false)

  const accept = React.useCallback(() => {
    localStorage.setItem(LS_KEY, 'true')
    setIsAccepted(true)
  }, [])

  React.useEffect(() => {
    const isAccepted = localStorage.getItem(LS_KEY) === 'true'
    setIsAccepted(isAccepted)
  }, [])

  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (isAccepted) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)]">
      {isLoaded && (
        <div className="flex max-h-full max-w-2xl flex-col items-center overflow-y-auto overscroll-none p-8 text-center">
          <h1 className="mb-8 text-2xl font-bold uppercase sm:text-3xl">
            Warning: flashing lights and rapid color changes ahead
          </h1>

          <p className="mb-2 text-lg">
            This website contains elements that rapidly change in color and
            brightness. These effects may potentially trigger seizures for
            people with photosensitive epilepsy. Viewer discretion is advised.
          </p>

          <p className="mb-8 text-lg">
            If you are prone to epileptic seizures or are sensitive to flashing
            lights and rapid color changes, please proceed with caution.
          </p>

          <button
            className="border border-zinc-100 px-4 py-2 text-lg"
            onClick={accept}
          >
            Continue to Website
          </button>
        </div>
      )}
    </div>
  )
}
