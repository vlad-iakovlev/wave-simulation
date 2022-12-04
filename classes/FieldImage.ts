import { Field } from './Field'
import { PixelValueSource } from './Pixel'

export class FieldImage {
  fields: [Field, Field, Field]

  constructor(public width: number, public height: number) {
    this.fields = [
      new Field(width, height, 0.02),
      new Field(width, height),
      new Field(width, height, -0.04),
    ]
  }

  iterate() {
    this.fields.forEach((field) => field.iterate())
  }

  setMaterial(
    condition: (i: number, j: number) => boolean,
    massMultiplier: number
  ) {
    this.fields.forEach((field) => {
      field.forEach((pixel, x, y) => {
        if (condition(x, y)) {
          pixel.mass *= massMultiplier
        }
      })
    })
  }

  getImageData(source: PixelValueSource) {
    const image = new ImageData(this.width, this.height)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const index = (x + y * this.width) * 4
        for (let i = 0; i < 3; i++) {
          image.data[index + i] =
            this.fields[i].pixels[x][y].getValue(source) * 255
        }
        image.data[index + 3] = 255
      }
    }

    return image
  }

  draw(canvas: HTMLCanvasElement, source: PixelValueSource) {
    canvas.width = this.width
    canvas.height = this.height

    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, this.width, this.height)
    ctx?.putImageData(this.getImageData(source), 0, 0)
  }
}
