import { GPU, Texture } from 'gpu.js'

type Kernel2D = (this: {
  pixelMass: number[][]
  pixelHeight: number[][][]
  pixelAccumulated: number[][][]
  pixelVelocity: number[][][]
  frame: number
  width: number
  height: number
  x: number
  y: number
}) => number

type Kernel3D = (this: {
  pixelMass: number[][]
  pixelHeight: number[][][]
  pixelAccumulated: number[][][]
  pixelVelocity: number[][][]
  frame: number
  width: number
  height: number
  x: number
  y: number
  i: number
}) => number

type KernelImage = (this: {
  pixelMass: number[][]
  pixelHeight: number[][][]
  pixelAccumulated: number[][][]
  pixelVelocity: number[][][]
  width: number
  height: number
  x: number
  y: number
  r: number
  g: number
  b: number
}) => void

// eslint-disable-next-line @typescript-eslint/ban-types
const getFunctionBody = (func: Function) => {
  const funcString = func.toString()
  return funcString
    .substring(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'))
    .replaceAll('this.', '')
}

export class FieldImage {
  private gpu = new GPU()

  private createTexture2D = this.gpu.createKernel(
    function (value: number) {
      return value
    },
    {
      output: [this.height, this.width],
      pipeline: true,
      immutable: true,
    }
  ) as (value: number) => Texture

  private createTexture3D = this.gpu.createKernel(
    function (value: number) {
      return value
    },
    {
      output: [3, this.height, this.width],
      pipeline: true,
      immutable: true,
    }
  ) as (value: number) => Texture

  private pixelMass = this.createTexture2D(1)
  private pixelHeight = this.createTexture3D(0)
  private pixelAccumulated = this.createTexture3D(0)
  private pixelVelocity = this.createTexture3D(0)
  private frame = 0

  private createKernel2D(kernel: Kernel2D) {
    eval(`
      kernel = function (
        pixelMass,
        pixelHeight,
        pixelAccumulated,
        pixelVelocity,
        frame
      ) {
        const width = this.output.y
        const height = this.output.x
        const x = this.thread.y
        const y = this.thread.x
        ${getFunctionBody(kernel)}
      }
    `)

    const createdKernel = this.gpu.createKernel(kernel as any, {
      output: [this.height, this.width],
      pipeline: true,
      immutable: true,
    })

    return () => {
      return createdKernel(
        this.pixelMass,
        this.pixelHeight,
        this.pixelAccumulated,
        this.pixelVelocity,
        this.frame
      ) as Texture
    }
  }

  private createKernel3D(kernel: Kernel3D) {
    eval(`
      kernel = function (
        pixelMass,
        pixelHeight,
        pixelAccumulated,
        pixelVelocity,
        frame
      ) {
        const width = this.output.z
        const height = this.output.y
        const x = this.thread.z
        const y = this.thread.y
        const i = this.thread.x
        ${getFunctionBody(kernel)}
      }
    `)

    const createdKernel = this.gpu.createKernel(kernel as any, {
      output: [3, this.height, this.width],
      pipeline: true,
      immutable: true,
    })

    return () => {
      return createdKernel(
        this.pixelMass,
        this.pixelHeight,
        this.pixelAccumulated,
        this.pixelVelocity,
        this.frame
      ) as Texture
    }
  }

  private createKernelImage(kernel: KernelImage) {
    eval(`
      kernel = function (
        pixelMass,
        pixelHeight,
        pixelAccumulated,
        pixelVelocity
      ) {
        const width = this.output.x
        const height = this.output.y
        const x = this.thread.x
        const y = this.thread.y
        let r = 0
        let g = 0
        let b = 0
        ${getFunctionBody(kernel)}
        this.color(r, g, b)
      }
    `)

    const createdKernel = this.gpu.createKernel(kernel as any, {
      output: [this.width, this.height],
      graphical: true,
    })

    return () => {
      createdKernel(
        this.pixelMass,
        this.pixelHeight,
        this.pixelAccumulated,
        this.pixelVelocity
      )
      return createdKernel.canvas as HTMLCanvasElement
    }
  }

  private kernels = {
    updateMass: this.createKernel2D(function () {
      return this.pixelMass[this.x][this.y]
    }),

    updateHeight: this.createKernel3D(function () {
      return this.pixelHeight[this.x][this.y][this.i]
    }),

    updateAccumulated: this.createKernel3D(function () {
      return this.pixelAccumulated[this.x][this.y][this.i]
    }),

    updateVelocity: this.createKernel3D(function () {
      return this.pixelVelocity[this.x][this.y][this.i]
    }),

    iterateHeight: this.createKernel3D(function () {
      return (
        this.pixelHeight[this.x][this.y][this.i] +
        this.pixelVelocity[this.x][this.y][this.i]
      )
    }),

    iterateAccumulated: this.createKernel3D(function () {
      return (
        this.pixelAccumulated[this.x][this.y][this.i] +
        Math.abs(this.pixelHeight[this.x][this.y][this.i])
      )
    }),

    iterateVelocity: this.createKernel3D(function () {
      if (this.pixelMass[this.x][this.y] === 0) {
        return 0
      }

      const force =
        (this.x > 0 ? this.pixelHeight[this.x - 1][this.y][this.i] : 0) +
        (this.y > 0 ? this.pixelHeight[this.x][this.y - 1][this.i] : 0) +
        (this.x < this.width - 1
          ? this.pixelHeight[this.x + 1][this.y][this.i]
          : 0) +
        (this.y < this.height - 1
          ? this.pixelHeight[this.x][this.y + 1][this.i]
          : 0)

      const count =
        (this.x > 0 ? 1 : 0) +
        (this.y > 0 ? 1 : 0) +
        (this.x < this.width - 1 ? 1 : 0) +
        (this.y < this.height - 1 ? 1 : 0)

      return (
        this.pixelVelocity[this.x][this.y][this.i] +
        (force / count - this.pixelHeight[this.x][this.y][this.i]) *
          (1 / this.pixelMass[this.x][this.y] - [0.02, 0, -0.04][this.i])
      )
    }),

    getImageByMass: this.createKernelImage(function () {
      this.r = this.g = this.b = this.pixelMass[this.x][this.y] / 100
    }),

    getImageByHeight: this.createKernelImage(function () {
      this.r = Math.abs(this.pixelHeight[this.x][this.y][0])
      this.g = Math.abs(this.pixelHeight[this.x][this.y][1])
      this.b = Math.abs(this.pixelHeight[this.x][this.y][2])
    }),

    getImageByAccumulated: this.createKernelImage(function () {
      this.r = Math.pow(this.pixelAccumulated[this.x][this.y][0] * 0.005, 2)
      this.g = Math.pow(this.pixelAccumulated[this.x][this.y][1] * 0.005, 2)
      this.b = Math.pow(this.pixelAccumulated[this.x][this.y][2] * 0.005, 2)
    }),
  }

  constructor(public readonly width: number, public readonly height: number) {}

  setUpdateMass(kernel: Kernel2D) {
    this.kernels.updateMass = this.createKernel2D(kernel)
  }

  setUpdateHeight(kernel: Kernel3D) {
    this.kernels.updateHeight = this.createKernel3D(kernel)
  }

  setUpdateAccumulated(kernel: Kernel3D) {
    this.kernels.updateAccumulated = this.createKernel3D(kernel)
  }

  setUpdateVelocity(kernel: Kernel3D) {
    this.kernels.updateVelocity = this.createKernel3D(kernel)
  }

  private updateValue(
    key: 'pixelMass' | 'pixelHeight' | 'pixelAccumulated' | 'pixelVelocity',
    newValue: Texture
  ) {
    this[key].delete()
    this[key] = newValue
  }

  iterate() {
    this.updateValue('pixelMass', this.kernels.updateMass())
    this.updateValue('pixelHeight', this.kernels.updateHeight())
    this.updateValue('pixelAccumulated', this.kernels.updateAccumulated())
    this.updateValue('pixelVelocity', this.kernels.updateVelocity())

    this.updateValue('pixelHeight', this.kernels.iterateHeight())
    this.updateValue('pixelAccumulated', this.kernels.iterateAccumulated())
    this.updateValue('pixelVelocity', this.kernels.iterateVelocity())

    this.frame++
  }

  draw(canvas: HTMLCanvasElement, source: 'mass' | 'height' | 'accumulated') {
    canvas.width = this.width
    canvas.height = this.height

    let image: HTMLCanvasElement
    switch (source) {
      case 'mass':
        image = this.kernels.getImageByMass()
        break

      case 'height':
        image = this.kernels.getImageByHeight()
        break

      case 'accumulated':
        image = this.kernels.getImageByAccumulated()
        break
    }

    const ctx = canvas.getContext('2d')
    ctx?.scale(1, -1)
    ctx?.drawImage(image, 0, 0, image.width, -image.height)
  }
}
