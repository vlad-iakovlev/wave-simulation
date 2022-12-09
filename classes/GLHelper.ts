export class GLHelper {
  private cssWidth = window.innerWidth
  private cssHeight = window.innerHeight
  private scale = window.devicePixelRatio
  readonly width = Math.floor(this.cssWidth * this.scale)
  readonly height = Math.floor(this.cssHeight * this.scale)

  readonly canvas = (() => {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.width = `${this.cssWidth}px`
    canvas.style.height = `${this.cssHeight}px`
    return canvas
  })()

  readonly gl = (() => {
    const gl = this.canvas.getContext('webgl2')
    if (!gl) throw new Error('Could not get WebGL2 context')
    gl.viewport(0, 0, this.width, this.height)

    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) throw new Error('Could not use EXT_color_buffer_float')

    return gl
  })()

  readonly fb = this.gl.createFramebuffer()

  createShader(type: number, source: string) {
    const shader = this.gl.createShader(type)
    if (!shader) throw new Error('Could not create shader')

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader)
      this.gl.deleteShader(shader)
      throw new Error(`Could not compile shader.\n${info}`)
    }

    return shader
  }

  createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.gl.createProgram()
    if (!program) throw new Error('Could not create program')

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program)
      this.gl.deleteProgram(program)
      throw new Error(`Could not link program.\n${info}`)
    }

    return program
  }

  createProgramFromSources(vs: string, fs: string) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vs)
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fs)
    return this.createProgram(vertexShader, fragmentShader)
  }

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

  bindFBAndTexture(texture: WebGLTexture | null) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb)

    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )
  }
}
