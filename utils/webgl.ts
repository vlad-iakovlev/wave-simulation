export const getWebGL2Context = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext('webgl2')
  if (!gl) throw new Error('Could not get WebGL2 context')

  const ext = gl.getExtension('EXT_color_buffer_float')
  if (!ext) throw new Error('Could not use EXT_color_buffer_float')

  return gl
}

export const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Could not compile shader.\n${info}`)
  }

  return shader
}

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram()
  if (!program) throw new Error('Could not create program')

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Could not link program.\n${info}`)
  }

  return program
}

export const createProgramFromSources = (
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string
) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)
  return createProgram(gl, vertexShader, fragmentShader)
}
