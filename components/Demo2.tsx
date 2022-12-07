import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

export const Demo2: FC = () => {
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

    fieldImage.current.setUpdateMass(function () {
      if (this.frame === 0) {
        const radius = Math.min(this.width, this.height) / 4
        const xCenter = (this.width - 1) / 2
        const yCenter = (this.height - 1) / 2

        if (
          this.x === Math.floor(xCenter - radius * (4 / 3)) - 1 &&
          this.y > yCenter - radius * (2 / 3) &&
          this.y < yCenter - radius / 2
        ) {
          return 0
        }

        if (
          Math.sqrt((this.x - xCenter) ** 2 + (this.y - yCenter) ** 2) < radius
        ) {
          return 1.5
        }
      }

      return this.pixelMass[this.x][this.y]
    })

    fieldImage.current.setUpdateHeight(function () {
      const radius = Math.min(this.width, this.height) / 4
      const xCenter = (this.width - 1) / 2
      const yCenter = (this.height - 1) / 2

      if (
        this.x === Math.floor(xCenter - radius * (4 / 3)) &&
        this.y > yCenter - radius * (2 / 3) &&
        this.y < yCenter - radius / 2
      ) {
        return Math.sin(this.frame * (Math.PI / 4))
      }

      return this.pixelHeight[this.x][this.y][this.i]
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
