import { FC, useCallback, useRef } from 'react'
import { FieldImage, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { DemoProps } from './DemoPage'

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

  vec4 calcMass() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y) / 2.0;
    return vec4(1.0 - mandelbrot(uv));
  }

  vec4 calcHeight() {
    vec2 center = vec2(u_resolution) * 0.5 - 0.5 + vec2(min(u_resolution.x, u_resolution.y) * 0.15, 0);
    float radius = min(u_resolution.x, u_resolution.y) * 0.1;
    float len = length(gl_FragCoord.xy - center) / radius;

    if (len < 1.0) {
      return vec4(cos(len * 5.0 * M_PI) * (1.0 - len) * 2.0);
    }

    return vec4(0);
  }

  vec4 calcVelocity() {
    return vec4(0);
  }
`)

export const Demo6: FC<DemoProps> = ({ width, height, scale, speed }) => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(width, height, scale, initShader)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      for (let i = 0; i < speed; i++) fieldImage.current.iterate()
      fieldImage.current.draw()
    }, [height, speed, scale, width])
  )

  return <div ref={root} />
}
