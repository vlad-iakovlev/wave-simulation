import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

export const Demo1: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useRef<FieldImage>()

  const run = useCallback((currentFieldImage: FieldImage) => {
    if (fieldImage.current === currentFieldImage && canvas.current) {
      currentFieldImage.iterate()
      currentFieldImage.draw(canvas.current, 'height')
      window.requestAnimationFrame(() => run(currentFieldImage))
    }
  }, [])

  const init = useCallback(() => {
    let { width, height } = document.documentElement.getBoundingClientRect()
    const scale = window.devicePixelRatio
    width = Math.floor(width * scale)
    height = Math.floor(height * scale)

    // iOS scroll triggers resize, ignore it
    if (
      fieldImage.current?.width === width &&
      fieldImage.current?.height === height
    ) {
      return
    }

    fieldImage.current = new FieldImage(width, height)

    fieldImage.current.setUpdateHeight(function (pixelHeight, frame) {
      const { x, y, z } = this.thread

      if (frame === 0) {
        if (
          Math.sqrt(
            (z - (this.output.z - 1) / 2) ** 2 +
              (y - (this.output.y - 1) / 2) ** 2
          ) <
          Math.min(this.output.z, this.output.y) / 4
        ) {
          return 1
        }

        return 0
      }

      return pixelHeight[z][y][x]
    })

    run(fieldImage.current)
  }, [run])

  useEffect(() => {
    init()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
    }
  }, [init])

  return <canvas className="w-full h-full" ref={canvas} />
}
