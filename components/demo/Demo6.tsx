import { getShader } from '../../classes/FieldImage/index'
import { DemoComponent } from '../layout/DemoComponent'
import { DemoProps } from '../layout/DemoPage'

const initShader = getShader(`
  float mandelbrot(vec2 uv) {
    vec2 c = uv * 5.0 - vec2(0.6, 0);
    vec2 z = vec2(0);
    for (int i = 0; i < 32; i++) {
      z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
      if (dot(z, z) > 4.0) return 1.0;
    }
    return 0.0;
  }

  void main () {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y) / 2.0;

    o_acceleration = DEFAULT_ACCELERATION * (1.0 - mandelbrot(uv));
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);

    vec2 center = vec2(u_resolution) * 0.5 - 0.5 + vec2(min(u_resolution.x, u_resolution.y) * 0.15, 0);
    float radius = min(u_resolution.x, u_resolution.y) * 0.1;
    float len = length(gl_FragCoord.xy - center) / radius;

    if (len < 1.0) {
      o_height = vec4(cos(len * 5.0 * M_PI) * (1.0 - len) * 2.0);
    }
  }
`)

export const Demo6 = ({ width, height, scale, speed }: DemoProps) => (
  <DemoComponent
    width={width}
    height={height}
    scale={scale}
    speed={speed}
    initShader={initShader}
  />
)
