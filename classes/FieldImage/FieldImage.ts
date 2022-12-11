import { GET_DEFAULT_FRAGMENT_SHADERS, TEXTURES_INDEXES } from './constants'
import { createProgramFromSources, getWebGL2Context } from '../../utils/webgl'
import { FieldImageShaders } from './types'

export class FieldImage {
  private width = Math.floor(this.cssWidth * this.scale)
  private height = Math.floor(this.cssHeight * this.scale)

  readonly canvas = (() => {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.width = `${this.cssWidth}px`
    canvas.style.height = `${this.cssHeight}px`
    return canvas
  })()

  private gl = (() => {
    const gl = getWebGL2Context(this.canvas)
    gl.viewport(0, 0, this.width, this.height)
    return gl
  })()

  private vs = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `

  private fs = GET_DEFAULT_FRAGMENT_SHADERS()

  private programsCache = new Map<string, WebGLProgram>()

  private createAndUseProgram(fs: string) {
    const programFromCache = this.programsCache.get(fs)
    if (programFromCache) {
      this.gl.useProgram(programFromCache)
      return programFromCache
    }

    const program = createProgramFromSources(this.gl, this.vs, fs)
    this.programsCache.set(fs, program)
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
      this.width,
      this.height
    )

    return program
  }

  private fbCache = new Map<WebGLTexture, WebGLFramebuffer>()

  private createAndUseTextureFB(texture: WebGLTexture) {
    const fbFromCache = this.fbCache.get(texture)
    if (fbFromCache) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbFromCache)
      return fbFromCache
    }

    const fb = this.gl.createFramebuffer()
    if (!fb) throw new Error('Cannot create framebuffer')
    this.fbCache.set(texture, fb)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )

    return fb
  }

  private renderToTexture(texture: WebGLTexture) {
    this.createAndUseTextureFB(texture)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  private renderToCanvas() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  createTexture() {
    const texture = this.gl.createTexture()
    if (!texture) throw new Error('Could not create texture')

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA32F,
      this.width,
      this.height,
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

  private textures = {
    read: {
      mass: this.createTexture(),
      height: this.createTexture(),
      velocity: this.createTexture(),
    },
    write: {
      mass: this.createTexture(),
      height: this.createTexture(),
      velocity: this.createTexture(),
    },
  }

  private initTextures(fs: Required<FieldImageShaders>) {
    for (const textureName of ['mass', 'height', 'velocity'] as const) {
      this.createAndUseProgram(fs[textureName])
      this.renderToTexture(this.textures.read[textureName])
    }
  }

  private swapTextures(textureName: 'mass' | 'height' | 'velocity') {
    ;[this.textures.read[textureName], this.textures.write[textureName]] = [
      this.textures.write[textureName],
      this.textures.read[textureName],
    ]
  }

  private runProgram(
    method: 'iterate' | 'draw',
    textureName: 'mass' | 'height' | 'velocity'
  ) {
    const program = this.createAndUseProgram(this.fs[method][textureName])

    for (const name of ['mass', 'height', 'velocity'] as const) {
      this.gl.activeTexture(this.gl.TEXTURE0 + TEXTURES_INDEXES[name])
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.read[name])
      this.gl.uniform1i(
        this.gl.getUniformLocation(program, `u_${name}`),
        TEXTURES_INDEXES[name]
      )
    }

    if (method === 'draw') {
      this.renderToCanvas()
    } else {
      this.renderToTexture(this.textures.write[textureName])
      this.swapTextures(textureName)
    }
  }

  constructor(
    private cssWidth: number,
    private cssHeight: number,
    private scale: number,
    initShaders: FieldImageShaders
  ) {
    this.initTextures({ ...this.fs.init, ...initShaders })
  }

  iterate() {
    this.runProgram('iterate', 'height')
    this.runProgram('iterate', 'velocity')
  }

  draw(textureName: 'mass' | 'height' | 'velocity') {
    this.runProgram('draw', textureName)
  }
}
