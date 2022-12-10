export const getShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    const float M_PI = radians(180.0);

    uniform vec2 u_dimensions;

    ${code}

    out vec4 o_result;

    void main() {
      o_result = calc();
    }
  `
}

export const getIterateShader = (code: string) => {
  return getShader(`
    uniform sampler2D u_mass;
    uniform sampler2D u_height;
    uniform sampler2D u_velocity;

    ${code}
  `)
}

export const getDrawShader = (code: string) => {
  return getShader(`
    uniform sampler2D u_mass;
    uniform sampler2D u_height;
    uniform sampler2D u_velocity;

    ${code}
  `)
}
