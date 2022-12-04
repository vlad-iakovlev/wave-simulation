import { useCallback, useRef } from 'react'
import { Field } from '../classes/Field'

interface UseWaveGeneratorProps {
  fields: Field[]
  iRange: [number, number]
  jRange: [number, number]
  framesLimit?: number
}

export const useWaveGenerator = ({
  fields,
  iRange,
  jRange,
  framesLimit = Infinity,
}: UseWaveGeneratorProps) => {
  const frame = useRef(0)

  return useCallback(() => {
    if (frame.current > framesLimit) {
      return
    }

    const heightValue = Math.sin(frame.current * 0.8) * 12

    fields.forEach((field) => {
      for (let i = iRange[0]; i <= iRange[1]; i++) {
        for (let j = jRange[0]; j <= jRange[1]; j++) {
          field.pixels[i][j].height = heightValue
        }
      }
    })

    frame.current++
  }, [fields, framesLimit, iRange, jRange])
}
