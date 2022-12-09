import { getDrawShader, getNoopShader, getShader } from './utils'

export const TEXTURES_INDEXES = {
  mass: 1,
  height: 2,
  velocity: 3,
} as const

export const GET_DEFAULT_FRAGMENT_SHADERS = () => ({
  init: {
    mass: `#version 300 es
      precision highp float;
      out vec4 o_result;
      void main() {
        o_result = vec4(1);
      }
    `,

    height: `#version 300 es
      precision highp float;
      out vec4 o_result;
      void main() {
        o_result = vec4(0);
      }
    `,

    velocity: `#version 300 es
      precision highp float;
      out vec4 o_result;
      void main() {
        o_result = vec4(0);
      }
    `,
  },

  update: {
    mass: getNoopShader('mass'),
    height: getNoopShader('height'),
    velocity: getNoopShader('velocity'),
  },

  iterate: {
    mass: getNoopShader('mass'),

    height: getShader(`
      vec4 calc() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);
        return texelFetch(u_height, texelCoord, 0) + texelFetch(u_velocity, texelCoord, 0);
      }
    `),

    velocity: getShader(`
      const vec4 MASS_CORRECTION = vec4(0.98, 1, 1.02, 0);

      vec4 calc() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);

        vec4 sides = step(1.0, vec4(gl_FragCoord.xy, u_dimensions.xy - gl_FragCoord.xy));
        vec4 angles = sides * sides.yzwx * 0.3;

        vec4 force =
          sides.x * texelFetch(u_height, texelCoord + ivec2(-1, 0), 0) +
          sides.y * texelFetch(u_height, texelCoord + ivec2(0, -1), 0) +
          sides.z * texelFetch(u_height, texelCoord + ivec2(1, 0), 0) +
          sides.w * texelFetch(u_height, texelCoord + ivec2(0, 1), 0) +
          angles.x * texelFetch(u_height, texelCoord + ivec2(-1, -1), 0) +
          angles.y * texelFetch(u_height, texelCoord + ivec2(1, -1), 0) +
          angles.z * texelFetch(u_height, texelCoord + ivec2(1, 1), 0) +
          angles.w * texelFetch(u_height, texelCoord + ivec2(-1, 1), 0);

        float count =
          sides.x + sides.y + sides.z + sides.w +
          angles.x + angles.y + angles.z + angles.w;

        return texelFetch(u_velocity, texelCoord, 0) +
          (force * (1.0 / count) - texelFetch(u_height, texelCoord, 0)) *
          (MASS_CORRECTION * texelFetch(u_mass, texelCoord, 0).x);
      }
    `),
  },

  draw: {
    mass: getDrawShader('mass'),
    height: getDrawShader('height'),
    velocity: getDrawShader('velocity'),
  },
})
