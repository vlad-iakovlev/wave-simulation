import { FieldImageShaderGroup } from './types'
import { getShader } from './utils'

export const TEXTURES_INDEXES = {
  mass: 1,
  height: 2,
  velocity: 3,
}

interface Shaders {
  init: Required<FieldImageShaderGroup>
  update?: FieldImageShaderGroup
  iterate?: FieldImageShaderGroup
  draw?: FieldImageShaderGroup
}

export const GET_DEFAULT_FRAGMENT_SHADERS = (): Shaders => ({
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

  iterate: {
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

        float weight = 1.0 / (dot(sides, vec4(1)) + dot(angles, vec4(1)));
        sides *= weight;
        angles *= weight;

        vec4 force =
          angles.x * texelFetch(u_height, texelCoord + ivec2(-1, -1), 0) +
          sides.y  * texelFetch(u_height, texelCoord + ivec2( 0, -1), 0) +
          angles.y * texelFetch(u_height, texelCoord + ivec2( 1, -1), 0) +
          sides.x  * texelFetch(u_height, texelCoord + ivec2(-1,  0), 0) +
          -1.0     * texelFetch(u_height, texelCoord                , 0) +
          sides.z  * texelFetch(u_height, texelCoord + ivec2( 1,  0), 0) +
          angles.w * texelFetch(u_height, texelCoord + ivec2(-1,  1), 0) +
          sides.w  * texelFetch(u_height, texelCoord + ivec2( 0,  1), 0) +
          angles.z * texelFetch(u_height, texelCoord + ivec2( 1,  1), 0);

        vec4 mass = MASS_CORRECTION * texelFetch(u_mass, texelCoord, 0).x;
        return texelFetch(u_velocity, texelCoord, 0) + force * mass;
      }
    `),
  },

  draw: {
    height: getShader(`
      vec4 calc() {
        vec4 value = abs(texelFetch(u_height, ivec2(gl_FragCoord.xy), 0));
        return vec4(value.xyz, 1);
      }
    `),
  },
})
