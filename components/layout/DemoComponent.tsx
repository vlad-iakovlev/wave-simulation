import assert from 'assert'
import { useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../../classes/FieldImage/index'
import { useRaf } from '../../hooks/useRaf'

export type DemoComponentProps = {
  width: number
  height: number
  scale: number
  speed: number
  initShader?: string
  iterateShader?: string
  drawShader?: string
}

export const DemoComponent = ({
  width,
  height,
  scale,
  speed,
  initShader,
  iterateShader,
  drawShader,
}: DemoComponentProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const fieldImageRef = useRef<FieldImage>(undefined)

  useRaf(
    useCallback(() => {
      if (!fieldImageRef.current) {
        assert(rootRef.current, 'Could not get root ref')

        fieldImageRef.current = new FieldImage({
          root: rootRef.current,
          width,
          height,
          scale,
          initShader,
        })
      }

      for (let i = 0; i < speed; i++)
        fieldImageRef.current.iterate(iterateShader)
      fieldImageRef.current.draw(drawShader)
    }, [drawShader, width, height, scale, initShader, speed, iterateShader]),
  )

  useEffect(() => {
    fieldImageRef.current?.destroy()
    fieldImageRef.current = undefined
  }, [width, height, scale, initShader])

  return <div ref={rootRef} />
}
