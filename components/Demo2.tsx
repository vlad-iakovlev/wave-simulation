import { FC, useCallback, useRef } from 'react'
import { FieldImage, FieldImageShaders, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { DemoProps } from './DemoPage'

const initShaders: FieldImageShaders = {
  mass: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_resolution) * 0.5 - 0.5;
      float radius = min(u_resolution.x, u_resolution.y) * 0.25;

      if (length(gl_FragCoord.xy - center) < radius) {
        return vec4(0.7);
      }

      return vec4(1);
    }
  `),

  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_resolution) * 0.5 - 0.5;
      float radius = min(u_resolution.x, u_resolution.y) * 0.05;
      vec2 diff = (gl_FragCoord.xy - center + vec2(radius * 6.0, -radius * 3.0)) / radius;

      if (length(diff) < 1.0) {
        return vec4(cos(diff.x * 5.0 * M_PI) * (1.0 - length(diff)) * 2.0);
      }

      return vec4(0);
    }
  `),
}

export const Demo2: FC<DemoProps> = ({ width, height, scale, speed }) => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(width, height, scale, initShaders)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      for (let i = 0; i < speed; i++) fieldImage.current.iterate()
      fieldImage.current.draw('height')
    }, [height, speed, scale, width])
  )

  return <div ref={root} />
}
