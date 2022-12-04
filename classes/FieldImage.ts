import { Field } from './Field'
import { PixelValueSource } from './Pixel'

export class FieldImage {
  fields: [Field, Field, Field]

  constructor(public size: [number, number]) {
    this.fields = [
      new Field(size, 0.02),
      new Field(size),
      new Field(size, -0.04),
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
      field.forEach((pixel, i, j) => {
        if (condition(i, j)) {
          pixel.mass *= massMultiplier
        }
      })
    })
  }

  getImageData(source: PixelValueSource) {
    const image = new ImageData(this.size[0], this.size[1])

    for (let i = 0; i < this.size[0]; i++) {
      for (let j = 0; j < this.size[1]; j++) {
        const index = (i + j * this.size[0]) * 4
        for (let k = 0; k < 3; k++) {
          image.data[index + k] =
            this.fields[k].pixels[i][j].getValue(source) * 255
        }
        image.data[index + 3] = 255
      }
    }

    return image
  }

  draw(canvas: HTMLCanvasElement, source: PixelValueSource) {
    canvas.width = this.size[0]
    canvas.height = this.size[1]

    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, this.size[0], this.size[1])
    ctx?.putImageData(this.getImageData(source), 0, 0)
  }
}
