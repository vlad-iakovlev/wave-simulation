import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useFullscreenOnSpace } from '../hooks/useFullscreenOnSpace'

export interface DemoProps {
  width: number
  height: number
  scale: number
  speed: number
}

export interface DemoPageProps {
  Demo: FC<DemoProps>
}

export const DemoPage: FC<DemoPageProps> = ({ Demo }) => {
  const root = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scale, setScale] = useState(0)

  const setDimensions = useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    setScale(Math.min(2, window.devicePixelRatio))
  }, [])

  useEffect(() => {
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
