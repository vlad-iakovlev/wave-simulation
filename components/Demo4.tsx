import { FC, useCallback, useRef } from 'react'
import { FieldImage, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { DemoProps } from './DemoPage'

const initShader = getShader(`
  void main () {
    o_acceleration = DEFAULT_ACCELERATION;
    o_height = vec4(0);
    o_accumulated = vec4(0);
    o_velocity = vec4(0);

    vec2 center = vec2(u_resolution) * 0.5 - 0.5;
    float radius = min(u_resolution.x, u_resolution.y) * 0.25;
    vec2 diff = gl_FragCoord.xy - center;

    if (length(gl_FragCoord.xy - center) < radius) {
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

export const Demo4: FC<DemoProps> = ({ width, height, scale, speed }) => {
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
