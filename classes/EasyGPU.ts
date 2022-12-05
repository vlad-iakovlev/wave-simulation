import {
  GPU,
  KernelFunction,
  KernelVariable,
  Texture,
  ThreadKernelVariable,
} from 'gpu.js'

type WithTexture<T extends unknown[]> = T extends [unknown]
  ? [T[0] | Texture]
  : T extends [unknown, unknown]
  ? [T[0] | Texture, T[1] | Texture]
  : T extends [unknown, unknown, unknown]
  ? [T[0] | Texture, T[1] | Texture, T[2] | Texture]
  : T extends [unknown, unknown, unknown, unknown]
  ? [T[0] | Texture, T[1] | Texture, T[2] | Texture, T[3] | Texture]
  : Array<T[number] | Texture>

export class EasyGPU {
  private gpu = new GPU()

  create2dKernel = <T extends ThreadKernelVariable[]>(
    kernel: KernelFunction<T>
  ) => {
    return this.gpu.createKernel(kernel, {
      output: [this.height, this.width],
      pipeline: true,
      immutable: true,
    }) as (...args: WithTexture<T>) => Texture
  }

  create3dKernel = <T extends ThreadKernelVariable[]>(
    kernel: KernelFunction<T>
  ) => {
    return this.gpu.createKernel(kernel, {
      output: [3, this.height, this.width],
      pipeline: true,
      immutable: true,
    }) as (...args: WithTexture<T>) => Texture
  }

  createImageKernel = <T extends ThreadKernelVariable[]>(
    kernel: KernelFunction<T>
  ) => {
    const createdKernel = this.gpu.createKernel(kernel, {
      output: [this.width, this.height],
      graphical: true,
    })

    return (...args: WithTexture<T>) => {
      createdKernel(...(args as KernelVariable[]))
      return createdKernel.canvas as HTMLCanvasElement
    }
  }

  constructor(private width: number, private height: number) {}
}
