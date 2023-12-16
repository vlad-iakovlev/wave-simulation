import { getShader } from '../../classes/FieldImage/index.js'
import { DemoComponent } from '../layout/DemoComponent.jsx'
import { DemoProps } from '../layout/DemoPage.jsx'

const initShader = getShader(`
  void main () {
    o_acceleration = DEFAULT_ACCELERATION;
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);

    vec2 center = vec2(u_resolution) * 0.5 - 0.5;
    float radius = min(u_resolution.x, u_resolution.y) * 0.25;
    float len = length(gl_FragCoord.xy - center) / radius;

    if (len < 1.0) {
      o_height = vec4(cos(len * 5.0 * M_PI) * (1.0 - len) * 2.0);
    }
  }
`)

export const Demo5: React.FC<DemoProps> = ({ width, height, scale, speed }) => {
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
