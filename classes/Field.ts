import { Pixel } from './Pixel'

export class Field {
  pixels: Pixel[][] = []

  constructor(public size: [number, number], massShift = 0) {
    for (let i = 0; i < size[0]; i++) {
      this.pixels[i] = []
      for (let j = 0; j < size[1]; j++) {
        this.pixels[i][j] = new Pixel()
        this.pixels[i][j].massShift = massShift
      }
    }
  }

  forEach(callback: (pixel: Pixel, i: number, j: number) => void) {
    for (let i = 0; i < this.size[0]; i++) {
      for (let j = 0; j < this.size[1]; j++) {
        callback(this.pixels[i][j], i, j)
      }
    }
  }

  iterate() {
    for (let i = 0; i < this.size[0]; i++) {
      for (let j = 0; j < this.size[1]; j++) {
        this.pixels[i][j].iterateHeight()
        this.pixels[i][j].iterateAccumulated()
      }
    }

    for (let i = 0; i < this.size[0]; i++) {
      for (let j = 0; j < this.size[1]; j++) {
        let force = 0
        let count = 0

        if (i > 0) {
          force += this.pixels[i - 1][j].height
          count += 1
        }

        if (i < this.size[0] - 1) {
          force += this.pixels[i + 1][j].height
          count += 1
        }

        if (j > 0) {
          force += this.pixels[i][j - 1].height
          count += 1
        }

        if (j < this.size[1] - 1) {
          force += this.pixels[i][j + 1].height
          count += 1
        }

        this.pixels[i][j].iterateVelocity(force / count)
      }
    }
  }
}
