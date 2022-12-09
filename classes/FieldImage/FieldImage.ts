import { GET_DEFAULT_FRAGMENT_SHADERS, TEXTURES_INDEXES } from './constants'
import { createProgramFromSources, getWebGL2Context } from '../../utils/webgl'

export interface FieldImageUserShaders {
  mass?: string
  height?: string
  velocity?: string
}

export class FieldImage {
  private cssWidth = window.innerWidth
  private cssHeight = window.innerHeight
  private scale = window.devicePixelRatio
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

  private fb = this.gl.createFramebuffer()

  private programsCache = new Map<string, WebGLProgram>()
  private frame = 0

  private vs = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `

  private fs = GET_DEFAULT_FRAGMENT_SHADERS()

  createTexture() {
    const texture = this.gl.createTexture()
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

  private createProgram(fs: string) {
    const program = createProgramFromSources(this.gl, this.vs, fs)

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

    return program
  }

  private renderToTexture(texture: WebGLTexture | null) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb)

    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  private renderToCanvas() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  private createReadTexture(textureName: 'mass' | 'height' | 'velocity') {
    const program = this.createProgram(this.fs.init[textureName])
    this.gl.useProgram(program)

    const texture = this.createTexture()
    this.gl.activeTexture(this.gl.TEXTURE0 + TEXTURES_INDEXES[textureName])
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.renderToTexture(texture)

    return texture
  }

  private textures = {
    read: {
      mass: this.createReadTexture('mass'),
      height: this.createReadTexture('height'),
      velocity: this.createReadTexture('velocity'),
    },
    write: {
      mass: this.createTexture(),
      height: this.createTexture(),
      velocity: this.createTexture(),
    },
  }

  private swapTextures(textureName: 'mass' | 'height' | 'velocity') {
    const oldReadTexture = this.textures.read[textureName]
    this.textures.read[textureName] = this.textures.write[textureName]
    this.textures.write[textureName] = oldReadTexture

    this.gl.activeTexture(this.gl.TEXTURE0 + TEXTURES_INDEXES[textureName])
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.read[textureName])
  }

  private runProgram(
    method: 'update' | 'iterate' | 'draw',
    textureName: 'mass' | 'height' | 'velocity'
  ) {
    let program = this.programsCache.get(`${method}_${textureName}`)

    if (!program) {
      program = this.createProgram(this.fs[method][textureName])
      this.gl.useProgram(program)

      for (const name of ['mass', 'height', 'velocity'] as const) {
        this.gl.uniform1i(
          this.gl.getUniformLocation(program, `u_${name}`),
          TEXTURES_INDEXES[name]
        )
      }

      this.gl.uniform2f(
        this.gl.getUniformLocation(program, 'u_dimensions'),
        this.width,
        this.height
      )

      this.programsCache.set(`${method}_${textureName}`, program)
    } else {
      this.gl.useProgram(program)
    }

    this.gl.uniform1i(
      this.gl.getUniformLocation(program, 'u_frame'),
      this.frame
    )

    if (method === 'draw') {
      this.renderToCanvas()
    } else {
      this.renderToTexture(this.textures.write[textureName])
      this.swapTextures(textureName)
    }
  }

  constructor(userShaders: FieldImageUserShaders) {
    for (const name of ['mass', 'height', 'velocity'] as const) {
      const userShader = userShaders?.[name]
      if (userShader) this.fs.update[name] = userShader
    }
  }

  iterate() {
    this.runProgram('update', 'mass')
    this.runProgram('update', 'height')
    this.runProgram('update', 'velocity')

    this.runProgram('iterate', 'height')
    this.runProgram('iterate', 'velocity')

    this.frame++
  }

  draw(textureName: 'mass' | 'height' | 'velocity') {
    this.runProgram('draw', textureName)
  }
}
