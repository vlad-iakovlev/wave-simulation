import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

const WIDTH = 1200
const HEIGHT = 800

export const Demo1: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useMemo(() => new FieldImage(WIDTH, HEIGHT), [])

  const run = useCallback(() => {
    if (canvas.current) {
      fieldImage.draw(canvas.current, 'height')
      fieldImage.iterate()
      window.requestAnimationFrame(run)
    }
  }, [fieldImage])

  useEffect(() => {
    fieldImage.setMass(
      (x, y) => x === 0 || x === WIDTH - 1 || y === 0 || y === HEIGHT - 1,
      Infinity
    )

    fieldImage.setHeight(
      (x, y) =>
        Math.sqrt((x - (WIDTH - 1) / 2) ** 2 + (y - (HEIGHT - 1) / 2) ** 2) <
        100,
      1
    )

    run()
  }, [fieldImage, run])

  return <canvas ref={canvas} />
}
