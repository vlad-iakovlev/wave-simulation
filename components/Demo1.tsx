import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

export const Demo1: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useRef<FieldImage>()

  const run = useCallback((currentFieldImage: FieldImage) => {
    if (fieldImage.current === currentFieldImage && canvas.current) {
      currentFieldImage.draw(canvas.current, 'height')
      currentFieldImage.iterate()
      window.requestAnimationFrame(() => run(currentFieldImage))
    }
  }, [])

  const init = useCallback(() => {
    const { width, height } = document.documentElement.getBoundingClientRect()

    fieldImage.current = new FieldImage(width, height)

    fieldImage.current.setHeight(
      (x, y) =>
        Math.sqrt((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) <
        Math.min(width, height) / 3,
      1
    )

    run(fieldImage.current)
  }, [run])

  useEffect(() => {
    init()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
    }
  }, [init])

  return <canvas ref={canvas} />
}
