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

export const getNoopShader = (textureName: 'mass' | 'height' | 'velocity') => {
  return getShader(`
    vec4 calc() {
      return texelFetch(u_${textureName}, ivec2(gl_FragCoord.xy), 0);
    }
  `)
}

export const getDrawShader = (textureName: 'mass' | 'height' | 'velocity') => {
  return getShader(`
    vec4 calc() {
      vec4 value = abs(texelFetch(u_${textureName}, ivec2(gl_FragCoord.xy), 0));
      return vec4(value.xyz, 1);
    }
  `)
}
