import { memoize } from '../../utils/memoize'
import { createProgramFromSources } from '../../utils/webgl'
import {
  DRAW_SHADER,
  INIT_SHADER,
  ITERATE_SHADER,
  TEXTURE_NAMES,
  VERTEX_SHADER,
} from './constants'

interface FieldImageConstructorProps {
  root: HTMLElement
  width: number
  height: number
  scale: number
  initShader?: string
}

export class FieldImage {
  private root: HTMLElement
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private textures: WebGLTexture[][]

  private rdPos = 0

  private get wrPos() {
    return this.rdPos ? 0 : 1
  }

  private getProgram = memoize((shader: string) => {
    const program = createProgramFromSources(this.gl, VERTEX_SHADER, shader)
    this.gl.useProgram(program)

    const positionLoc = this.gl.getAttribLocation(program, 'a_position')
    const positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW,
    )
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.uniform2f(
      this.gl.getUniformLocation(program, 'u_resolution'),
      this.canvas.width,
      this.canvas.height,
    )

    return program
  })

  private getTexturesFB = memoize((textures: WebGLTexture[]) => {
    const fb = this.gl.createFramebuffer()
    if (!fb) throw new Error('Cannot create framebuffer')

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb)
    textures.forEach((texture, index) => {
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0 + index,
        this.gl.TEXTURE_2D,
        texture,
        0,
      )
    })
    this.gl.drawBuffers(
      textures.map((texture, index) => {
        return this.gl.COLOR_ATTACHMENT0 + index
      }),
    )

    return fb
  })

  private createTexture(index: number) {
    const texture = this.gl.createTexture()
    if (!texture) throw new Error('Could not create texture')

    this.gl.activeTexture(this.gl.TEXTURE0 + index)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA32F,
      this.canvas.width,
      this.canvas.height,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      null,
    )

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST,
    )

    return texture
  }

  private runProgram(shader: string, toCanvas = false) {
    const program = this.getProgram(shader)
    this.gl.useProgram(program)

    TEXTURE_NAMES.forEach((textureName, index) => {
      this.gl.uniform1i(
        this.gl.getUniformLocation(program, `u_${textureName}`),
        TEXTURE_NAMES.length * this.rdPos + index,
      )
    })

    if (toCanvas) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    } else {
      const fb = this.getTexturesFB(this.textures[this.wrPos])
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      this.rdPos = this.wrPos
    }
  }

  private static createCanvas(width: number, height: number, scale: number) {
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(width * scale)
    canvas.height = Math.floor(height * scale)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    return canvas
  }

  private static getWebGL2Context(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2')
    if (!gl) throw new Error('Could not get WebGL2 context')

    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) throw new Error('Could not use EXT_color_buffer_float')

    return gl
  }

  constructor({
    root,
    width,
    height,
    scale,
    initShader = INIT_SHADER,
  }: FieldImageConstructorProps) {
    this.root = root

    this.canvas = FieldImage.createCanvas(width, height, scale)
    this.root.appendChild(this.canvas)

    this.gl = FieldImage.getWebGL2Context(this.canvas)

    this.textures = [0, 1].map((pos) => {
      return TEXTURE_NAMES.map((textureName, index) => {
        return this.createTexture(TEXTURE_NAMES.length * pos + index)
      })
    })

    this.runProgram(initShader)
  }

  destroy() {
    this.root.removeChild(this.canvas)
  }

  iterate(iterateShader = ITERATE_SHADER) {
    this.runProgram(iterateShader)
  }

  draw(drawShader = DRAW_SHADER) {
    this.runProgram(drawShader, true)
  }
}
