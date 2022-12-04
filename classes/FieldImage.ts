const MASS_SHIFT = [0.02, 0, -0.04]

type PixelValueSource = 'height' | 'accumulated'

export class FieldImage {
  pixelMass: number[][] = []
  pixelHeight: number[][][] = []
  pixelVelocity: number[][][] = []
  pixelAccumulated: number[][][] = []

  constructor(public width: number, public height: number) {
    for (let x = 0; x < width; x++) {
      this.pixelMass[x] = []
      this.pixelHeight[x] = []
      this.pixelVelocity[x] = []
      this.pixelAccumulated[x] = []

      for (let y = 0; y < height; y++) {
        this.pixelMass[x][y] = 1
        this.pixelHeight[x][y] = [0, 0, 0]
        this.pixelVelocity[x][y] = [0, 0, 0]
        this.pixelAccumulated[x][y] = [0, 0, 0]
      }
    }
  }

  iterate() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let i = 0; i < 3; i++) {
          this.pixelHeight[x][y][i] += this.pixelVelocity[x][y][i]
          this.pixelAccumulated[x][y][i] += Math.abs(this.pixelHeight[x][y][i])
        }
      }
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!Number.isFinite(this.pixelMass[x][y])) continue

        for (let i = 0; i < 3; i++) {
          let force = 0
          let count = 0

          if (x > 0) {
            force += this.pixelHeight[x - 1][y][i]
            count += 1
          }

          if (x < this.width - 1) {
            force += this.pixelHeight[x + 1][y][i]
            count += 1
          }

          if (y > 0) {
            force += this.pixelHeight[x][y - 1][i]
            count += 1
          }

          if (y < this.height - 1) {
            force += this.pixelHeight[x][y + 1][i]
            count += 1
          }

          const speed = 1 / this.pixelMass[x][y] - MASS_SHIFT[i]
          this.pixelVelocity[x][y][i] +=
            (force / count - this.pixelHeight[x][y][i]) * speed
        }
      }
    }
  }

  setMass(condition: (x: number, y: number) => boolean, mass: number) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (condition(x, y)) {
          this.pixelMass[x][y] = mass
        }
      }
    }
  }

  setHeight(condition: (x: number, y: number) => boolean, height: number) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (condition(x, y)) {
          this.pixelHeight[x][y] = [height, height, height]
        }
      }
    }
  }

  getImageData(source: PixelValueSource) {
    const image = new ImageData(this.width, this.height)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const index = (x + y * this.width) * 4
        for (let i = 0; i < 3; i++) {
          switch (source) {
            case 'height': {
              const height = this.pixelHeight[x][y][i]
              image.data[index + i] =
                (height < 0 ? 0 : height > 1 ? 1 : height) * 255
              break
            }

            case 'accumulated': {
              const accumulated = this.pixelAccumulated[x][y][i] * 0.0005
              image.data[index + i] =
                (accumulated > 1 ? 1 : accumulated * accumulated) * 255
              break
            }
          }
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
