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
  `),
}

export const Demo4: FC<DemoProps> = ({ width, height, scale }) => {
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

      fieldImage.current.iterate()
      fieldImage.current.iterate()
      fieldImage.current.draw('height')
    }, [height, scale, width])
  )

  return <div ref={root} />
}
