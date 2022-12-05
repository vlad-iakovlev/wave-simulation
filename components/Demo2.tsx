import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

export const Demo2: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useRef<FieldImage>()

  const run = useCallback((currentFieldImage: FieldImage) => {
    if (fieldImage.current === currentFieldImage && canvas.current) {
      currentFieldImage.iterate()
      currentFieldImage.draw(canvas.current, 'accumulated')
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

    fieldImage.current.setUpdateMass(function (pixelMass, frame) {
      const width = this.output.y
      const height = this.output.x
      const { x, y } = this.thread

      if (frame === 0) {
        if (
          Math.sqrt((y - (width - 1) / 2) ** 2 + (x - (height - 1) / 2) ** 2) <
          Math.min(width, height) / 4
        ) {
          return 1.33
        }

        return 1
      }

      return pixelMass[y][x]
    })

    fieldImage.current.setUpdateHeight(function (pixelHeight, frame) {
      const width = this.output.z
      const height = this.output.y
      const { x, y, z } = this.thread

      if (frame === 0) {
        return 0
      }

      if (
        frame < 300 &&
        z === Math.floor(width / 2 - Math.min(width, height) / 3) &&
        y > height / 2 - Math.min(width, height) / 5 &&
        y < height / 2 - Math.min(width, height) / 7
      ) {
        return Math.sin(frame * 0.8) * 12
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
