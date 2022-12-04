import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'
import { useWaveGenerator } from '../hooks/useWaveGenerator'

const WIDTH = 600
const HEIGHT = 400

export const Demo2: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useMemo(() => new FieldImage(WIDTH, HEIGHT), [])

  const generateWave = useWaveGenerator({
    fieldImage,
    xRange: useMemo(() => [WIDTH / 2 - 135, WIDTH / 2 - 135], []),
    yRange: useMemo(() => [HEIGHT / 2 - 100, HEIGHT / 2 - 50], []),
    framesLimit: 300,
  })

  const run = useCallback(() => {
    if (canvas.current) {
      fieldImage.draw(canvas.current, 'accumulated')
      generateWave()
      fieldImage.iterate()
      window.requestAnimationFrame(run)
    }
  }, [fieldImage, generateWave])

  useEffect(() => {
    fieldImage.setMass(
      (x, y) => x === 0 || x === WIDTH - 1 || y === 0 || y === HEIGHT - 1,
      Infinity
    )

    fieldImage.setMass(
      (x, y) => Math.sqrt((x - WIDTH / 2) ** 2 + (y - HEIGHT / 2) ** 2) < 100,
      1.33
    )

    run()
  }, [fieldImage, run])

  return <canvas ref={canvas} />
}
