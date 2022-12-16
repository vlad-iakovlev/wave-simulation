import { FC } from 'react'
import { getDrawShader, getShader } from '../classes/FieldImage'
import { DemoComponent } from './DemoComponent'
import { DemoProps } from './DemoPage'

const initShader = getShader(`
  float triangle(vec2 p) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0 / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sign(p.y);
  }

  void main() {
    vec4 acceleration = vec4(1.03, 1.01, 0.975, 0.97);

    o_acceleration = acceleration;
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);

    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5 + 0.5) / min(u_resolution.x, u_resolution.y) * 2.0;

    if (triangle(uv * 2.5) < 0.0) {
      o_acceleration = pow(acceleration, vec4(3)) * pow(1.0 / 1.5, 2.0);
    }

    // if (triangle((uv + vec2(0.4, 0)) * 2.5) < 0.0) {
    //   o_acceleration = pow(acceleration, vec4(3)) * pow(1.0 / 1.5, 2.0);
    // }

    // if (triangle((uv * vec2(1, -1) + vec2(-0.4, 0.1)) * 2.5) < 0.0) {
    //   o_acceleration = pow(acceleration, vec4(3)) * pow(1.0 / 1.5, 2.0);
    // }

    vec2 diff = (uv + vec2(0.5, 0));
    float angle = radians(20.0);
    diff = vec2(diff.x * cos(angle) + diff.y * sin(angle), - diff.x * sin(angle) + diff.y * cos(angle)) * vec2(20, 15);

    if (length(diff) < 1.0) {
      o_height = vec4(cos(diff.x * sqrt(min(u_resolution.x, u_resolution.y)) * 0.2 * M_PI) * (1.0 - length(diff)) * 2.0);
    }
  }
`)

const iterateShader = getShader(`
  float box(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float getFallOff(ivec2 coord) {
    return 1.0 - clamp(box(vec2(coord) / u_resolution.xy - 0.5, vec2(0.45)), 0.0, 1.0);
  }

  vec4 getForce() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);
    vec4 sides = step(1.0, vec4(gl_FragCoord.xy, u_resolution.xy - gl_FragCoord.xy));
    vec4 angles = sides * sides.yzwx * 0.3;

    float weight = 1.0 / (dot(sides, vec4(1)) + dot(angles, vec4(1)));
    sides *= weight;
    angles *= weight;

    return
      angles.x * (texelFetch(u_height, texelCoord + ivec2(-1, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1, -1), 0)) +
      sides.y  * (texelFetch(u_height, texelCoord + ivec2( 0, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 0, -1), 0)) +
      angles.y * (texelFetch(u_height, texelCoord + ivec2( 1, -1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1, -1), 0)) +
      sides.x  * (texelFetch(u_height, texelCoord + ivec2(-1,  0), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1,  0), 0)) +
      -1.0     * (texelFetch(u_height, texelCoord                , 0) + texelFetch(u_velocity, texelCoord                , 0)) +
      sides.z  * (texelFetch(u_height, texelCoord + ivec2( 1,  0), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1,  0), 0)) +
      angles.w * (texelFetch(u_height, texelCoord + ivec2(-1,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2(-1,  1), 0)) +
      sides.w  * (texelFetch(u_height, texelCoord + ivec2( 0,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 0,  1), 0)) +
      angles.z * (texelFetch(u_height, texelCoord + ivec2( 1,  1), 0) + texelFetch(u_velocity, texelCoord + ivec2( 1,  1), 0));
  }

  void main() {
    ivec2 texelCoord = ivec2(gl_FragCoord.xy);
    vec4 nextHeight = texelFetch(u_height, texelCoord, 0) + texelFetch(u_velocity, texelCoord, 0);

    o_acceleration = texelFetch(u_acceleration, texelCoord, 0);
    o_height = nextHeight;
    o_accumulated = texelFetch(u_accumulated, texelCoord, 0) + abs(nextHeight);
    o_velocity = texelFetch(u_velocity, texelCoord, 0) * getFallOff(texelCoord) +
      getForce() * texelFetch(u_acceleration, texelCoord, 0);
  }
`)

const drawShader = getDrawShader(`
  void main() {
    vec4 value = texelFetch(u_accumulated, ivec2(gl_FragCoord.xy), 0);
    value *= value;
    value /= min(u_resolution.x, u_resolution.y);
    float purple = pow(value.a / dot(value.rgb, vec3(1)), 2.0) * value.a;
    o_color = vec4(value.rgb + vec3(purple, 0, purple), 1);
  }
`)

export const Demo2: FC<DemoProps> = ({ width, height, scale, speed }) => {
  return (
    <DemoComponent
      width={width}
      height={height}
      scale={scale}
      speed={speed}
      initShader={initShader}
      iterateShader={iterateShader}
      drawShader={drawShader}
    />
  )
}
