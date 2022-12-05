import { GPU, Texture } from 'gpu.js'

type PixelValueSource = 'height' | 'accumulated'

export class FieldImage {
  private gpu = new GPU()
  private pixelMass: Texture | number[][]
  private pixelHeight: Texture | number[][][]
  private pixelVelocity: Texture | number[][][]
  private pixelAccumulated: Texture | number[][][]

  private iterateHeightKernel = this.gpu.createKernel(
    function (pixelHeight: number[][][], pixelVelocity: number[][][]) {
      const { x: i, y, z: x } = this.thread
      return pixelHeight[x][y][i] + pixelVelocity[x][y][i]
    },
    { output: [3, this.height, this.width], pipeline: true, immutable: true }
  )

  private iterateAccumulatedKernel = this.gpu.createKernel(
    function (pixelHeight: number[][][], pixelAccumulated: number[][][]) {
      const { x: i, y, z: x } = this.thread
      return pixelAccumulated[x][y][i] + Math.abs(pixelHeight[x][y][i])
    },
    { output: [3, this.height, this.width], pipeline: true, immutable: true }
  )

  private iterateVelocityKernel = this.gpu.createKernel(
    function (
      pixelHeight: number[][][],
      pixelVelocity: number[][][],
      pixelMass: number[][]
    ) {
      const { x: i, y, z: x } = this.thread

      if (pixelMass[x][y] <= 0 || pixelMass[x][y] > 100)
        return pixelVelocity[x][y][i]

      let force = 0
      let count = 0

      if (x > 0) {
        force += pixelHeight[x - 1][y][i]
        count += 1
      }

      if (y > 0) {
        force += pixelHeight[x][y - 1][i]
        count += 1
      }

      if (x < this.output.z - 1) {
        force += pixelHeight[x + 1][y][i]
        count += 1
      }

      if (y < this.output.y - 1) {
        force += pixelHeight[x][y + 1][i]
        count += 1
      }

      return (
        pixelVelocity[x][y][i] +
        (force / count - pixelHeight[x][y][i]) *
          (1 / pixelMass[x][y] - [0.02, 0, -0.04][i])
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

  constructor(private width: number, private height: number) {
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
    this.iterateHeight()
    this.iterateAccumulated()
    this.iterateVelocity()
  }

  private getImageByHeight() {
    this.getImageByHeightKernel(this.pixelHeight)
    return new ImageData(
      this.getImageByHeightKernel.getPixels() as unknown as Uint8ClampedArray,
      this.width,
      this.height
    )
  }

  private getImageByAccumulated() {
    this.getImageByAccumulatedKernel(this.pixelAccumulated)
    return new ImageData(
      this.getImageByAccumulatedKernel.getPixels() as unknown as Uint8ClampedArray,
      this.width,
      this.height
    )
  }

  draw(canvas: HTMLCanvasElement, source: PixelValueSource) {
    canvas.width = this.width
    canvas.height = this.height

    // GPU.js makes the image flipped vertically
    canvas.style.transform = 'scale(1, -1)'

    const ctx = canvas.getContext('2d')
    switch (source) {
      case 'height':
        ctx?.putImageData(this.getImageByHeight(), 0, 0)
        break

      case 'accumulated':
        ctx?.putImageData(this.getImageByAccumulated(), 0, 0)
        break
    }
  }
}
