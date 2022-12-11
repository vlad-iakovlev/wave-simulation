export const getShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    const float M_PI = radians(180.0);

    uniform sampler2D u_mass;
    uniform sampler2D u_height;
    uniform sampler2D u_velocity;
    uniform vec2 u_resolution;

    ${code}

    layout(location = 0) out vec4 o_mass;
    layout(location = 1) out vec4 o_height;
    layout(location = 2) out vec4 o_velocity;

    void main() {
      o_mass = calcMass();
      o_height = calcHeight();
      o_velocity = calcVelocity();
    }
  `
}

export const getDrawShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    uniform sampler2D u_mass;
    uniform sampler2D u_height;
    uniform sampler2D u_velocity;
    uniform vec2 u_resolution;

    ${code}

    out vec4 o_color;

    void main() {
      o_color = calcColor();
    }
  `
}
