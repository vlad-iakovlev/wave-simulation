import { FC, useCallback, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'

export interface DemoComponentProps {
  width: number
  height: number
  scale: number
  speed: number
  initShader?: string
  iterateShader?: string
  drawShader?: string
}

export const DemoComponent: FC<DemoComponentProps> = ({
  width,
  height,
  scale,
  speed,
  initShader,
  iterateShader,
  drawShader,
}) => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(width, height, scale, initShader)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      for (let i = 0; i < speed; i++) fieldImage.current.iterate(iterateShader)
      fieldImage.current.draw(drawShader)
    }, [drawShader, width, height, scale, initShader, speed, iterateShader])
  )

  return <div ref={root} />
}
