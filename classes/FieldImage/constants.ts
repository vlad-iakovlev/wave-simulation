import { getDrawShader, getShader } from './utils'

export const TEXTURE_NAMES = [
  'acceleration',
  'height',
  'accumulated',
  'velocity',
] as const

export const VERTEX_SHADER = `#version 300 es
  in vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`

export const INIT_SHADER = getShader(`
  vec4 calcAcceleration() {
    return DEFAULT_ACCELERATION;
  }

  vec4 calcHeight() {
    return vec4(0);
  }

  vec4 calcAccumulated() {
    return vec4(0);
  }

  vec4 calcVelocity() {
    return vec4(0);
  }
`)

export const ITERATE_SHADER = getShader(`
  vec4 getNextHeight(ivec2 coord) {
    return texelFetch(u_height, coord, 0) + texelFetch(u_velocity, coord, 0);
  }

  vec4 calcAcceleration() {
    return texelFetch(u_acceleration, ivec2(gl_FragCoord.xy), 0);
  }

  vec4 calcHeight() {
    return getNextHeight(ivec2(gl_FragCoord.xy));
  }

  vec4 calcAccumulated() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);
    return texelFetch(u_accumulated, texelCoord, 0) + abs(getNextHeight(texelCoord));
  }

  vec4 calcVelocity() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);

    vec4 sides = step(1.0, vec4(gl_FragCoord.xy, u_resolution.xy - gl_FragCoord.xy));
    vec4 angles = sides * sides.yzwx * 0.3;

    float weight = 1.0 / (dot(sides, vec4(1)) + dot(angles, vec4(1)));
    sides *= weight;
    angles *= weight;

    vec4 force =
      angles.x * getNextHeight(texelCoord + ivec2(-1, -1)) +
      sides.y  * getNextHeight(texelCoord + ivec2( 0, -1)) +
      angles.y * getNextHeight(texelCoord + ivec2( 1, -1)) +
      sides.x  * getNextHeight(texelCoord + ivec2(-1,  0)) +
      -1.0     * getNextHeight(texelCoord                ) +
      sides.z  * getNextHeight(texelCoord + ivec2( 1,  0)) +
      angles.w * getNextHeight(texelCoord + ivec2(-1,  1)) +
      sides.w  * getNextHeight(texelCoord + ivec2( 0,  1)) +
      angles.z * getNextHeight(texelCoord + ivec2( 1,  1));

    return texelFetch(u_velocity, texelCoord, 0) + force * texelFetch(u_acceleration, texelCoord, 0);
  }
`)

export const DRAW_SHADER = getDrawShader(`
  vec4 calcColor() {
    vec4 value = abs(texelFetch(u_height, ivec2(gl_FragCoord.xy), 0));
    return vec4(value.rgb, 1);
  }
`)
