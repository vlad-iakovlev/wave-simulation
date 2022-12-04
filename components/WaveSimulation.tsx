import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'
import { useWaveGenerator } from '../hooks/useWaveGenerator'

const WIDTH = 600
const HEIGHT = 600

export const WaveSimulation: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useMemo(() => new FieldImage([WIDTH, HEIGHT]), [])

  // const generateWave = useWaveGenerator({
  //   fields: fieldImage.fields,
  //   iRange: useMemo(() => [WIDTH / 2 - 135, WIDTH / 2 - 135], []),
  //   jRange: useMemo(() => [HEIGHT / 2 - 100, HEIGHT / 2 - 50], []),
  //   framesLimit: 300,
  // })

  // const run = useCallback(() => {
  //   if (canvas.current) {
  //     fieldImage.draw(canvas.current, 'accumulated')
  //   }

  //   generateWave()
  //   fieldImage.iterate()
  //   window.requestAnimationFrame(run)
  // }, [fieldImage, generateWave])

  // useEffect(() => {
  //   fieldImage.setMaterial(
  //     (i, j) => i === 0 || i === WIDTH - 1 || j === 0 || j === HEIGHT - 1,
  //     Infinity
  //   )

  //   fieldImage.setMaterial(
  //     (i, j) => Math.sqrt((i - WIDTH / 2) ** 2 + (j - HEIGHT / 2) ** 2) < 100,
  //     1.33
  //   )

  //   run()
  // }, [fieldImage, run])

  const run = useCallback(() => {
    if (canvas.current) {
      fieldImage.draw(canvas.current, 'height')
    }

    fieldImage.iterate()
    window.requestAnimationFrame(run)
  }, [fieldImage])

  useEffect(() => {
    fieldImage.setMaterial(
      (i, j) => i === 0 || i === WIDTH - 1 || j === 0 || j === HEIGHT - 1,
      Infinity
    )

    fieldImage.fields.forEach((field) => {
      field.forEach((pixel, i, j) => {
        if (Math.sqrt((i - WIDTH / 2) ** 2 + (j - HEIGHT / 2) ** 2) < 100) {
          pixel.height = 1
        }
      })
    })

    run()
  }, [fieldImage, run])

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvas} />
    </div>
  )
}
