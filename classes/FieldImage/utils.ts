export const getShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    const float M_PI = radians(180.0);

    uniform sampler2D u_mass;
    uniform sampler2D u_height;
    uniform sampler2D u_velocity;
    uniform vec2 u_dimensions;
    uniform int u_frame;
    out vec4 o_result;

    ${code}

    void main() {
      o_result = calc();
    }
  `
}
