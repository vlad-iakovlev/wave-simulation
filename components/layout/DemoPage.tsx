import React from 'react'
import { useFullscreenOnSpace } from '../../hooks/useFullscreenOnSpace.js'

export interface DemoProps {
  width: number
  height: number
  scale: number
  speed: number
}

export interface DemoPageProps {
  Demo: React.FC<DemoProps>
}

export const DemoPage: React.FC<DemoPageProps> = ({ Demo }) => {
  const root = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const [scale, setScale] = React.useState(0)

  const setDimensions = React.useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    setScale(Math.min(2, window.devicePixelRatio))
  }, [])

  React.useEffect(() => {
    setDimensions()
    window.addEventListener('resize', setDimensions)
    return () => window.removeEventListener('resize', setDimensions)
  }, [setDimensions])

  useFullscreenOnSpace(root)

  return (
    <div ref={root}>
      {width > 0 && height > 0 && scale > 0 && (
        <Demo width={width} height={height} scale={scale} speed={2} />
      )}
    </div>
  )
}
