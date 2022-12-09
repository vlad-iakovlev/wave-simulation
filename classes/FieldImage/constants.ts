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
        o_result = vec4(1, 0, 0, 0);
      }
    `,

    height: `#version 300 es
      precision highp float;
      out vec4 o_result;
      void main() {
        o_result = vec4(0, 0, 0, 0);
      }
    `,

    velocity: `#version 300 es
      precision highp float;
      out vec4 o_result;
      void main() {
        o_result = vec4(0, 0, 0, 0);
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
      const float FORCE_SIDE = 1.0;
      const float FORCE_ANGLE = 0.3;
      const vec4 MASS_CORRECTION = vec4(0.98, 1, 1.02, 0);

      vec4 calc() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);
        float mass = texelFetch(u_mass, texelCoord, 0).x;

        if (mass < 0.001) {
          return vec4(0, 0, 0, 0);
        }

        float left = gl_FragCoord.x;
        float top = gl_FragCoord.y;
        float right = u_dimensions.x - gl_FragCoord.x;
        float bottom = u_dimensions.y - gl_FragCoord.y;

        vec4 force = vec4(0, 0, 0, 0);
        float count = 0.0;

        if (left > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(-1, 0), 0) * FORCE_SIDE;
          count += FORCE_SIDE;
        }

        if (right > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(1, 0), 0) * FORCE_SIDE;
          count += FORCE_SIDE;
        }

        if (top > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(0, -1), 0) * FORCE_SIDE;
          count += FORCE_SIDE;
        }

        if (bottom > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(0, 1), 0) * FORCE_SIDE;
          count += FORCE_SIDE;
        }

        if (left > 1.0 && top > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(-1, -1), 0) * FORCE_ANGLE;
          count += FORCE_ANGLE;
        }

        if (right > 1.0 && top > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(1, -1), 0) * FORCE_ANGLE;
          count += FORCE_ANGLE;
        }

        if (left > 1.0 && bottom > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(-1, 1), 0) * FORCE_ANGLE;
          count += FORCE_ANGLE;
        }

        if (right > 1.0 && bottom > 1.0) {
          force += texelFetch(u_height, texelCoord + ivec2(1, 1), 0) * FORCE_ANGLE;
          count += FORCE_ANGLE;
        }

        return texelFetch(u_velocity, texelCoord, 0) +
          (force * (1.0 / count) - texelFetch(u_height, texelCoord, 0)) * (MASS_CORRECTION * (1.0 / mass));
      }
    `),
  },

  draw: {
    mass: getDrawShader('mass'),
    height: getDrawShader('height'),
    velocity: getDrawShader('velocity'),
  },
})
