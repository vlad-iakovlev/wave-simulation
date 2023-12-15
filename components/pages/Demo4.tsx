import { getShader } from '../../classes/FieldImage/index.js'
import { DemoComponent } from '../layout/DemoComponent.js'
import { DemoProps } from '../layout/DemoPage.js'

const initShader = getShader(`
  void main () {
    o_acceleration = DEFAULT_ACCELERATION;
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);

    vec2 center = vec2(u_resolution) * 0.5 - 0.5;
    float radius = min(u_resolution.x, u_resolution.y) * 0.25;
    vec2 diff = gl_FragCoord.xy - center;

    if (length(diff) < radius) {
      o_acceleration = pow(DEFAULT_ACCELERATION, vec4(2)) * pow(1.0 / 1.33, 2.0);
    }

    if (
      length(diff + u_resolution * vec2( 0.25,  0.25)) < radius * 0.5 ||
      length(diff + u_resolution * vec2( 0.25, -0.25)) < radius * 0.5 ||
      length(diff + u_resolution * vec2(-0.25,  0.25)) < radius * 0.5 ||
      length(diff + u_resolution * vec2(-0.25, -0.25)) < radius * 0.5
    ) {
      o_height = vec4(1);
    }
  }
`)

export const Demo4: React.FC<DemoProps> = ({ width, height, scale, speed }) => {
  return (
    <DemoComponent
      width={width}
      height={height}
      scale={scale}
      speed={speed}
      initShader={initShader}
    />
  )
}
