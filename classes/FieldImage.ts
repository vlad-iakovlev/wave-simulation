import { GPU, Texture } from 'gpu.js'

type Kernel2D = (this: {
  pixelMass: number[][]
  pixelHeight: number[][][]
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
  pixelVelocity: number[][][]
  width: number
  height: number
  x: number
  y: number
  color: (r: number, g?: number, b?: number, a?: number) => void
}) => void

// eslint-disable-next-line @typescript-eslint/ban-types
const getFunctionBody = (func: Function) => {
  const funcString = func.toString()
  return funcString.substring(
    funcString.indexOf('{') + 1,
    funcString.lastIndexOf('}')
  )
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
  private pixelVelocity = this.createTexture3D(0)
  private frame = 0

  private createKernel2D(kernel: Kernel2D) {
    eval(`
      kernel = function (
        pixelMass,
        pixelHeight,
        pixelVelocity,
        frame
      ) {
        ${getFunctionBody(kernel)
          .replaceAll('this.pixelMass', 'pixelMass')
          .replaceAll('this.pixelHeight', 'pixelHeight')
          .replaceAll('this.pixelVelocity', 'pixelVelocity')
          .replaceAll('this.frame', 'frame')
          .replaceAll('this.width', 'this.output.y')
          .replaceAll('this.height', 'this.output.x')
          .replaceAll('this.x', 'this.thread.y')
          .replaceAll('this.y', 'this.thread.x')}
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
        pixelVelocity,
        frame
      ) {
        ${getFunctionBody(kernel)
          .replaceAll('this.pixelMass', 'pixelMass')
          .replaceAll('this.pixelHeight', 'pixelHeight')
          .replaceAll('this.pixelVelocity', 'pixelVelocity')
          .replaceAll('this.frame', 'frame')
          .replaceAll('this.width', 'this.output.z')
          .replaceAll('this.height', 'this.output.y')
          .replaceAll('this.x', 'this.thread.z')
          .replaceAll('this.y', 'this.thread.y')
          .replaceAll('this.i', 'this.thread.x')}
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
        pixelVelocity
      ) {
        ${getFunctionBody(kernel)
          .replaceAll('this.pixelMass', 'pixelMass')
          .replaceAll('this.pixelHeight', 'pixelHeight')
          .replaceAll('this.pixelVelocity', 'pixelVelocity')
          .replaceAll('this.width', 'this.output.x')
          .replaceAll('this.height', 'this.output.y')
          .replaceAll('this.x', 'this.thread.x')
          .replaceAll('this.y', 'this.thread.y')}
      }
    `)

    const createdKernel = this.gpu.createKernel(kernel as any, {
      output: [this.width, this.height],
      graphical: true,
    })

    return () => {
      createdKernel(this.pixelMass, this.pixelHeight, this.pixelVelocity)
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

    updateVelocity: this.createKernel3D(function () {
      return this.pixelVelocity[this.x][this.y][this.i]
    }),

    iterateHeight: this.createKernel3D(function () {
      return (
        this.pixelHeight[this.x][this.y][this.i] +
        this.pixelVelocity[this.x][this.y][this.i]
      )
    }),

    iterateVelocity: this.createKernel3D(function () {
      if (this.pixelMass[this.x][this.y] === 0) {
        return 0
      }

      const l = this.x
      const r = this.width - this.x - 1
      const t = this.y
      const b = this.height - this.y - 1

      const force =
        (l > 0 ? this.pixelHeight[this.x - 1][this.y][this.i] : 0) +
        (t > 0 ? this.pixelHeight[this.x][this.y - 1][this.i] : 0) +
        (r > 0 ? this.pixelHeight[this.x + 1][this.y][this.i] : 0) +
        (b > 0 ? this.pixelHeight[this.x][this.y + 1][this.i] : 0) +
        (l > 0 && t > 0
          ? this.pixelHeight[this.x - 1][this.y - 1][this.i] / Math.PI
          : 0) +
        (r > 0 && t > 0
          ? this.pixelHeight[this.x + 1][this.y - 1][this.i] / Math.PI
          : 0) +
        (l > 0 && b > 0
          ? this.pixelHeight[this.x - 1][this.y + 1][this.i] / Math.PI
          : 0) +
        (r > 0 && b > 0
          ? this.pixelHeight[this.x + 1][this.y + 1][this.i] / Math.PI
          : 0)

      const count =
        (l > 0 ? 1 : 0) +
        (t > 0 ? 1 : 0) +
        (r > 0 ? 1 : 0) +
        (b > 0 ? 1 : 0) +
        (l > 0 && t > 0 ? 1 / Math.PI : 0) +
        (r > 0 && t > 0 ? 1 / Math.PI : 0) +
        (l > 0 && b > 0 ? 1 / Math.PI : 0) +
        (r > 0 && b > 0 ? 1 / Math.PI : 0)

      return (
        this.pixelVelocity[this.x][this.y][this.i] +
        (force / count - this.pixelHeight[this.x][this.y][this.i]) *
          ([0.98, 1, 1.04][this.i] / this.pixelMass[this.x][this.y])
      )
    }),

    getImageByMass: this.createKernelImage(function () {
      const c = this.pixelMass[this.x][this.y] / 10
      this.color(c, c, c)
    }),

    getImageByHeight: this.createKernelImage(function () {
      this.color(
        Math.abs(this.pixelHeight[this.x][this.y][0]),
        Math.abs(this.pixelHeight[this.x][this.y][1]),
        Math.abs(this.pixelHeight[this.x][this.y][2])
      )
    }),
  }

  constructor(public readonly width: number, public readonly height: number) {}

  setUpdateMass(kernel: Kernel2D) {
    this.kernels.updateMass = this.createKernel2D(kernel)
  }

  setUpdateHeight(kernel: Kernel3D) {
    this.kernels.updateHeight = this.createKernel3D(kernel)
  }

  setUpdateVelocity(kernel: Kernel3D) {
    this.kernels.updateVelocity = this.createKernel3D(kernel)
  }

  private updateValue(
    key: 'pixelMass' | 'pixelHeight' | 'pixelVelocity',
    newValue: Texture
  ) {
    this[key].delete()
    this[key] = newValue
  }

  iterate() {
    this.updateValue('pixelMass', this.kernels.updateMass())
    this.updateValue('pixelHeight', this.kernels.updateHeight())
    this.updateValue('pixelVelocity', this.kernels.updateVelocity())

    this.updateValue('pixelHeight', this.kernels.iterateHeight())
    this.updateValue('pixelVelocity', this.kernels.iterateVelocity())

    this.frame++
  }

  draw(canvas: HTMLCanvasElement, source: 'mass' | 'height') {
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
    }

    const ctx = canvas.getContext('2d')
    ctx?.scale(1, -1)
    ctx?.drawImage(image, 0, 0, image.width, -image.height)
  }
}
