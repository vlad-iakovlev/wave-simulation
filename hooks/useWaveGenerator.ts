import { useCallback, useRef } from 'react'
import { Field } from '../classes/Field'

interface UseWaveGeneratorProps {
  fields: Field[]
  xRange: [number, number]
  yRange: [number, number]
  framesLimit?: number
}

export const useWaveGenerator = ({
  fields,
  xRange,
  yRange,
  framesLimit = Infinity,
}: UseWaveGeneratorProps) => {
  const frame = useRef(0)

  return useCallback(() => {
    if (frame.current > framesLimit) {
      return
    }

    const heightValue = Math.sin(frame.current * 0.8) * 12

    fields.forEach((field) => {
      for (let x = xRange[0]; x <= xRange[1]; x++) {
        for (let y = yRange[0]; y <= yRange[1]; y++) {
          field.pixels[x][y].height = heightValue
        }
      }
    })

    frame.current++
  }, [fields, framesLimit, xRange, yRange])
}
