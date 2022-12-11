import { FC, useCallback, useRef } from 'react'
import { FieldImage, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { DemoProps } from './DemoPage'

const initShader = getShader(`
  vec4 calcMass() {
    vec2 center = vec2(u_resolution) * 0.5 - 0.5;
    float radius = min(u_resolution.x, u_resolution.y) * 0.25;

    if (length(gl_FragCoord.xy - center) < radius) {
      return vec4(0.7);
    }

    return vec4(1);
  }

  vec4 calcHeight() {
    vec2 center = vec2(u_resolution) * 0.5 - 0.5;
    float radius = min(u_resolution.x, u_resolution.y) * 0.15;
    vec2 diff = gl_FragCoord.xy - center;

    if (
      length(diff + u_resolution * vec2( 0.25,  0.25)) < radius ||
      length(diff + u_resolution * vec2( 0.25, -0.25)) < radius ||
      length(diff + u_resolution * vec2(-0.25,  0.25)) < radius ||
      length(diff + u_resolution * vec2(-0.25, -0.25)) < radius
    ) {
      return vec4(1);
    }

    return vec4(0);
  }

  vec4 calcVelocity() {
    return vec4(0);
  }

  vec4 calcAccumulated() {
    return vec4(0);
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
