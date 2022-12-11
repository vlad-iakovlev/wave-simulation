import { createProgramFromSources } from '../../utils/webgl'
import {
  DRAW_SHADER,
  INIT_SHADER,
  ITERATE_SHADER,
  TEXTURE_NAMES,
  VERTEX_SHADER,
} from './constants'

export class FieldImage {
  private canvasWidth = Math.floor(this.cssWidth * this.scale)
  private canvasHeight = Math.floor(this.cssHeight * this.scale)
  private rdPos = 0

  private get wrPos() {
    return this.rdPos ? 0 : 1
  }

  readonly canvas = (() => {
    const canvas = document.createElement('canvas')
    canvas.width = this.canvasWidth
    canvas.height = this.canvasHeight
    canvas.style.width = `${this.cssWidth}px`
    canvas.style.height = `${this.cssHeight}px`
    return canvas
  })()

  private gl = (() => {
    const gl = this.canvas.getContext('webgl2')
    if (!gl) throw new Error('Could not get WebGL2 context')

    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) throw new Error('Could not use EXT_color_buffer_float')

    return gl
  })()

  private programsCache = new Map<string, WebGLProgram>()

  private createAndUseProgram(shader: string) {
    const programFromCache = this.programsCache.get(shader)
    if (programFromCache) {
      this.gl.useProgram(programFromCache)
      return programFromCache
    }

    const program = createProgramFromSources(this.gl, VERTEX_SHADER, shader)
    this.programsCache.set(shader, program)
    this.gl.useProgram(program)

    const positionLoc = this.gl.getAttribLocation(program, 'a_position')
    const positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW
    )
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.uniform2f(
      this.gl.getUniformLocation(program, 'u_resolution'),
      this.canvasWidth,
      this.canvasHeight
    )

    return program
  }

  private fbCache = new Map<WebGLTexture, WebGLFramebuffer>()

  private createAndUseTexturesFB(textures: WebGLTexture[]) {
    const fbFromCache = this.fbCache.get(textures)
    if (fbFromCache) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbFromCache)
      return fbFromCache
    }

    const fb = this.gl.createFramebuffer()
    if (!fb) throw new Error('Cannot create framebuffer')
    this.fbCache.set(textures, fb)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb)
    textures.forEach((texture, index) => {
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0 + index,
        this.gl.TEXTURE_2D,
        texture,
        0
      )
    })
    this.gl.drawBuffers([
      this.gl.COLOR_ATTACHMENT0,
      this.gl.COLOR_ATTACHMENT1,
      this.gl.COLOR_ATTACHMENT2,
    ])

    return fb
  }

  private createTexture(index: number) {
    const texture = this.gl.createTexture()
    if (!texture) throw new Error('Could not create texture')

    this.gl.activeTexture(this.gl.TEXTURE0 + index)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA32F,
      this.canvasWidth,
      this.canvasHeight,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      null
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    )

    return texture
  }

  private textures = (() => {
    return [0, 1].map((pos) => {
      return TEXTURE_NAMES.map((textureName, index) => {
        return this.createTexture(TEXTURE_NAMES.length * pos + index)
      })
    })
  })()

  private runProgram(shader: string, toCanvas = false) {
    const program = this.createAndUseProgram(shader)

    TEXTURE_NAMES.forEach((textureName, index) => {
      this.gl.uniform1i(
        this.gl.getUniformLocation(program, `u_${textureName}`),
        TEXTURE_NAMES.length * this.rdPos + index
      )
    })

    if (toCanvas) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    } else {
      this.createAndUseTexturesFB(this.textures[this.wrPos])
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      this.rdPos = this.wrPos
    }
  }

  constructor(
    private cssWidth: number,
    private cssHeight: number,
    private scale: number,
    initShader = INIT_SHADER
  ) {
    this.runProgram(initShader)
  }

  iterate(iterateShader = ITERATE_SHADER) {
    this.runProgram(iterateShader)
  }

  draw(drawShader = DRAW_SHADER) {
    this.runProgram(drawShader, true)
  }
}
