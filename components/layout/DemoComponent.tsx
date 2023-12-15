import React from 'react'
import { FieldImage } from '../../classes/FieldImage/index.js'
import { useRaf } from '../../hooks/useRaf.js'

export interface DemoComponentProps {
  width: number
  height: number
  scale: number
  speed: number
  initShader?: string
  iterateShader?: string
  drawShader?: string
}

export const DemoComponent: React.FC<DemoComponentProps> = ({
  width,
  height,
  scale,
  speed,
  initShader,
  iterateShader,
  drawShader,
}) => {
  const root = React.useRef<HTMLDivElement>(null)
  const fieldImage = React.useRef<FieldImage>()

  useRaf(
    React.useCallback(() => {
      if (!fieldImage.current) {
        if (!root.current) throw new Error('Could not get root ref')

        fieldImage.current = new FieldImage({
          root: root.current,
          width,
          height,
          scale,
          initShader,
        })
      }

      for (let i = 0; i < speed; i++) fieldImage.current.iterate(iterateShader)
      fieldImage.current.draw(drawShader)
    }, [drawShader, width, height, scale, initShader, speed, iterateShader]),
  )

  React.useEffect(() => {
    fieldImage.current?.destroy()
    fieldImage.current = undefined
  }, [width, height, scale, initShader])

  return <div ref={root} />
}
