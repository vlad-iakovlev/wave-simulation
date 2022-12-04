import { useCallback, useRef } from 'react'
import { FastFieldImage } from '../classes/FastFieldImage'
import { FieldImage } from '../classes/FieldImage'

interface UseWaveGeneratorProps {
  fieldImage: FieldImage | FastFieldImage
  xRange: [number, number]
  yRange: [number, number]
  framesLimit?: number
}

export const useWaveGenerator = ({
  fieldImage,
  xRange,
  yRange,
  framesLimit = Infinity,
}: UseWaveGeneratorProps) => {
  const frame = useRef(0)

  return useCallback(() => {
    if (frame.current > framesLimit) return

    fieldImage.setHeight(
      (x, y) =>
        x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1],
      Math.sin(frame.current * 0.8) * 12
    )

    frame.current++
  }, [fieldImage, framesLimit, xRange, yRange])
}
