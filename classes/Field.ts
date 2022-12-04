import { Pixel } from './Pixel'

export class Field {
  pixels: Pixel[][] = []

  constructor(public width: number, public height: number, massShift = 0) {
    for (let x = 0; x < width; x++) {
      this.pixels[x] = []
      for (let y = 0; y < height; y++) {
        this.pixels[x][y] = new Pixel()
        this.pixels[x][y].massShift = massShift
      }
    }
  }

  forEach(callback: (pixel: Pixel, x: number, y: number) => void) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        callback(this.pixels[x][y], x, y)
      }
    }
  }

  iterate() {
    this.forEach((pixel) => {
      pixel.iterateHeight()
      pixel.iterateAccumulated()
    })

    this.forEach((pixel, x, y) => {
      let force = 0
      let count = 0

      if (x > 0) {
        force += this.pixels[x - 1][y].height
        count += 1
      }

      if (x < this.width - 1) {
        force += this.pixels[x + 1][y].height
        count += 1
      }

      if (y > 0) {
        force += this.pixels[x][y - 1].height
        count += 1
      }

      if (y < this.height - 1) {
        force += this.pixels[x][y + 1].height
        count += 1
      }

      pixel.iterateVelocity(force / count)
    })
  }
}
