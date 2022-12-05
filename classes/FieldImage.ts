import { KernelFunction, Texture } from 'gpu.js'
import { generate2dArray } from '../utils/generate2dArray'
import { generate3dArray } from '../utils/generate3dArray'
import { EasyGPU } from './EasyGPU'

type PixelValueSource = 'height' | 'accumulated'

export class FieldImage {
  private gpu = new EasyGPU(this.width, this.height)
  private pixelMass: Texture | number[][] = generate2dArray(
    this.width,
    this.height
  )
  private pixelHeight: Texture | number[][][] = generate3dArray(
    this.width,
    this.height,
    3
  )
  private pixelAccumulated: Texture | number[][][] = generate3dArray(
    this.width,
    this.height,
    3
  )
  private pixelVelocity: Texture | number[][][] = generate3dArray(
    this.width,
    this.height,
    3
  )
  private frame = 0

  private kernels = {
    updateMass: this.gpu.create2dKernel(function (
      pixelMass: number[][],
      frame: number
    ) {
      if (frame === 0) return 1
      const { x, y } = this.thread
      return pixelMass[y][x]
    }),

    updateHeight: this.gpu.create3dKernel(function (
      pixelHeight: number[][][],
      frame: number
    ) {
      if (frame === 0) return 0
      const { x, y, z } = this.thread
      return pixelHeight[z][y][x]
    }),

    updateAccumulated: this.gpu.create3dKernel(function (
      pixelAccumulated: number[][][],
      frame: number
    ) {
      if (frame === 0) return 0
      const { x, y, z } = this.thread
      return pixelAccumulated[z][y][x]
    }),

    updateVelocity: this.gpu.create3dKernel(function (
      pixelVelocity: number[][][],
      frame: number
    ) {
      if (frame === 0) return 0
      const { x, y, z } = this.thread
      return pixelVelocity[z][y][x]
    }),

    iterateHeight: this.gpu.create3dKernel(function (
      pixelHeight: number[][][],
      pixelVelocity: number[][][]
    ) {
      const { x, y, z } = this.thread
      return pixelHeight[z][y][x] + pixelVelocity[z][y][x]
    }),

    iterateAccumulated: this.gpu.create3dKernel(function (
      pixelAccumulated: number[][][],
      pixelHeight: number[][][]
    ) {
      const { x, y, z } = this.thread
      return pixelAccumulated[z][y][x] + Math.abs(pixelHeight[z][y][x])
    }),

    iterateVelocity: this.gpu.create3dKernel(function (
      pixelVelocity: number[][][],
      pixelMass: number[][],
      pixelHeight: number[][][]
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
    }),

    getImageByHeight: this.gpu.createImageKernel(function (
      pixelHeight: number[][][]
    ) {
      const { x, y } = this.thread
      this.color(
        pixelHeight[x][y][0],
        pixelHeight[x][y][1],
        pixelHeight[x][y][2]
      )
    }),

    getImageByAccumulated: this.gpu.createImageKernel(function (
      pixelAccumulated: number[][][]
    ) {
      const { x, y } = this.thread
      this.color(
        Math.pow(pixelAccumulated[x][y][0] * 0.0005, 2),
        Math.pow(pixelAccumulated[x][y][1] * 0.0005, 2),
        Math.pow(pixelAccumulated[x][y][2] * 0.0005, 2)
      )
    }),
  }

  constructor(public readonly width: number, public readonly height: number) {}

  setUpdateMass(kernel: KernelFunction<[number[][], number]>) {
    this.kernels.updateMass = this.gpu.create2dKernel(kernel)
  }

  setUpdateHeight(kernel: KernelFunction<[number[][][], number]>) {
    this.kernels.updateHeight = this.gpu.create3dKernel(kernel)
  }

  setUpdateAccumulated(kernel: KernelFunction<[number[][][], number]>) {
    this.kernels.updateAccumulated = this.gpu.create3dKernel(kernel)
  }

  setUpdateVelocity(kernel: KernelFunction<[number[][][], number]>) {
    this.kernels.updateVelocity = this.gpu.create3dKernel(kernel)
  }

  private updateValue(
    key: 'pixelMass' | 'pixelHeight' | 'pixelAccumulated' | 'pixelVelocity',
    newValue: Texture
  ) {
    const oldValue = this[key]
    if (!Array.isArray(oldValue)) oldValue.delete()
    this[key] = newValue
  }

  iterate() {
    this.updateValue(
      'pixelMass',
      this.kernels.updateMass(this.pixelMass, this.frame)
    )

    this.updateValue(
      'pixelHeight',
      this.kernels.updateHeight(this.pixelHeight, this.frame)
    )

    this.updateValue(
      'pixelAccumulated',
      this.kernels.updateAccumulated(this.pixelAccumulated, this.frame)
    )

    this.updateValue(
      'pixelVelocity',
      this.kernels.updateVelocity(this.pixelVelocity, this.frame)
    )

    this.updateValue(
      'pixelHeight',
      this.kernels.iterateHeight(this.pixelHeight, this.pixelVelocity)
    )

    this.updateValue(
      'pixelAccumulated',
      this.kernels.iterateAccumulated(this.pixelAccumulated, this.pixelHeight)
    )

    this.updateValue(
      'pixelVelocity',
      this.kernels.iterateVelocity(
        this.pixelVelocity,
        this.pixelMass,
        this.pixelHeight
      )
    )

    this.frame++
  }

  private getImageByHeight() {
    return this.kernels.getImageByHeight(this.pixelHeight)
  }

  private getImageByAccumulated() {
    return this.kernels.getImageByAccumulated(this.pixelAccumulated)
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
