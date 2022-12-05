import { GPU, Texture } from 'gpu.js'

type PixelValueSource = 'height' | 'accumulated'

export class FieldImage {
  private gpu = new GPU()
  private pixelMass: Texture | number[][]
  private pixelHeight: Texture | number[][][]
  private pixelVelocity: Texture | number[][][]
  private pixelAccumulated: Texture | number[][][]

  private uploadPixelMassKernel = this.gpu.createKernel(
    function (pixelMass: number[][]) {
      const { x, y } = this.thread
      return pixelMass[y][x]
    },
    { output: [this.height, this.width], pipeline: true, immutable: true }
  )

  private iterateHeightKernel = this.gpu.createKernel(
    function (pixelHeight: number[][][], pixelVelocity: number[][][]) {
      const { x, y, z } = this.thread
      return pixelHeight[z][y][x] + pixelVelocity[z][y][x]
    },
    { output: [3, this.height, this.width], pipeline: true, immutable: true }
  )

  private iterateAccumulatedKernel = this.gpu.createKernel(
    function (pixelHeight: number[][][], pixelAccumulated: number[][][]) {
      const { x, y, z } = this.thread
      return pixelAccumulated[z][y][x] + Math.abs(pixelHeight[z][y][x])
    },
    { output: [3, this.height, this.width], pipeline: true, immutable: true }
  )

  private iterateVelocityKernel = this.gpu.createKernel(
    function (
      pixelHeight: number[][][],
      pixelVelocity: number[][][],
      pixelMass: number[][]
    ) {
      const { x, y, z } = this.thread

      if (pixelMass[z][y] <= 0 || pixelMass[z][y] > 100)
        return pixelVelocity[z][y][x]

      const force =
        (z > 0 ? pixelHeight[z - 1][y][x] : 0) +
        (y > 0 ? pixelHeight[z][y - 1][x] : 0) +
        (z < this.output.z - 1 ? pixelHeight[z + 1][y][x] : 0) +
        (y < this.output.y - 1 ? pixelHeight[z][y + 1][x] : 0)

      const count =
        (z > 0 ? 1 : 0) +
        (y > 0 ? 1 : 0) +
        (z < this.output.z - 1 ? 1 : 0) +
        (y < this.output.y - 1 ? 1 : 0)

      return (
        pixelVelocity[z][y][x] +
        (force / count - pixelHeight[z][y][x]) *
          (1 / pixelMass[z][y] - [0.02, 0, -0.04][x])
      )
    },
    {
      output: [3, this.height, this.width],
      pipeline: true,
      immutable: true,
    }
  )

  private getImageByHeightKernel = this.gpu.createKernel(
    function (pixelHeight: number[][][]) {
      const { x, y } = this.thread
      this.color(
        pixelHeight[x][y][0],
        pixelHeight[x][y][1],
        pixelHeight[x][y][2]
      )
    },
    { output: [this.width, this.height], graphical: true }
  )

  private getImageByAccumulatedKernel = this.gpu.createKernel(
    function (pixelAccumulated: number[][][]) {
      const { x, y } = this.thread
      this.color(
        Math.pow(pixelAccumulated[x][y][0] * 0.0005, 2),
        Math.pow(pixelAccumulated[x][y][1] * 0.0005, 2),
        Math.pow(pixelAccumulated[x][y][2] * 0.0005, 2)
      )
    },
    { output: [this.width, this.height], graphical: true }
  )

  constructor(public readonly width: number, public readonly height: number) {
    this.pixelMass = []
    this.pixelHeight = []
    this.pixelVelocity = []
    this.pixelAccumulated = []

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

  setMass(condition: (x: number, y: number) => boolean, mass: number) {
    if (!Array.isArray(this.pixelMass)) {
      const texture = this.pixelMass
      this.pixelMass = texture.toArray() as number[][]
      texture.delete()
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (condition(x, y)) {
          this.pixelMass[x][y] = mass
        }
      }
    }
  }

  setHeight(condition: (x: number, y: number) => boolean, height: number) {
    if (!Array.isArray(this.pixelHeight)) {
      const texture = this.pixelHeight
      this.pixelHeight = texture.toArray() as number[][][]
      texture.delete()
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (condition(x, y)) {
          this.pixelHeight[x][y] = [height, height, height]
        }
      }
    }
  }

  private uploadPixelMass() {
    if (Array.isArray(this.pixelMass)) {
      this.pixelMass = this.uploadPixelMassKernel(this.pixelMass) as Texture
    }
  }

  private iterateHeight() {
    const pixelHeight = this.iterateHeightKernel(
      this.pixelHeight,
      this.pixelVelocity
    ) as Texture
    if (!Array.isArray(this.pixelHeight)) this.pixelHeight.delete()
    this.pixelHeight = pixelHeight
  }

  private iterateAccumulated() {
    const pixelAccumulated = this.iterateAccumulatedKernel(
      this.pixelHeight,
      this.pixelAccumulated
    ) as Texture
    if (!Array.isArray(this.pixelAccumulated)) this.pixelAccumulated.delete()
    this.pixelAccumulated = pixelAccumulated
  }

  private iterateVelocity() {
    const pixelVelocity = this.iterateVelocityKernel(
      this.pixelHeight,
      this.pixelVelocity,
      this.pixelMass
    ) as Texture
    if (!Array.isArray(this.pixelVelocity)) this.pixelVelocity.delete()
    this.pixelVelocity = pixelVelocity
  }

  iterate() {
    this.uploadPixelMass()
    this.iterateHeight()
    this.iterateAccumulated()
    this.iterateVelocity()
  }

  private getImageByHeight() {
    this.getImageByHeightKernel(this.pixelHeight)
    return this.getImageByHeightKernel.canvas as HTMLCanvasElement
  }

  private getImageByAccumulated() {
    this.getImageByAccumulatedKernel(this.pixelAccumulated)
    return this.getImageByAccumulatedKernel.canvas as HTMLCanvasElement
  }

  draw(canvas: HTMLCanvasElement, source: PixelValueSource) {
    canvas.width = this.width
    canvas.height = this.height

    let image: HTMLCanvasElement
    switch (source) {
      case 'height':
        image = this.getImageByHeight()
        break

      case 'accumulated':
        image = this.getImageByAccumulated()
        break
    }

    const ctx = canvas.getContext('2d')
    ctx?.scale(1, -1)
    ctx?.drawImage(image, 0, 0, image.width, -image.height)
  }
}
