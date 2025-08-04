import { useEffect, useRef, useState } from 'react'
import { useFullscreenOnSpace } from '../../hooks/useFullscreenOnSpace'

export type DemoProps = {
  width: number
  height: number
  scale: number
  speed: number
}

export type DemoPageProps = {
  Demo: React.ComponentType<DemoProps>
}

export const DemoPage = ({ Demo }: DemoPageProps) => {
  const root = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const setDimensions = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      setScale(Math.min(2, window.devicePixelRatio))
    }

    setDimensions()
    window.addEventListener('resize', setDimensions)
    return () => {
      window.removeEventListener('resize', setDimensions)
    }
  }, [])

  useFullscreenOnSpace(root)

  return (
    <div ref={root} className="touch-none">
      {width > 0 && height > 0 && scale > 0 && (
        <Demo width={width} height={height} scale={scale} speed={2} />
      )}
    </div>
  )
}
