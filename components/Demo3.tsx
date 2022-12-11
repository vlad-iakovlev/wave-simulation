import { FC, useCallback, useRef } from 'react'
import { FieldImage, FieldImageShaders, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { DemoProps } from './DemoPage'

const initShaders: FieldImageShaders = {
  mass: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_resolution) * 0.5 - 0.5;

      if (
        gl_FragCoord.x < 1.0 ||
        gl_FragCoord.y < 1.0 ||
        u_resolution.x - gl_FragCoord.x < 1.0 ||
        u_resolution.y - gl_FragCoord.y < 1.0 ||
        abs(gl_FragCoord.x - center.x) < 0.9 ||
        abs(gl_FragCoord.y - center.y) < 0.9
      ) {
        return vec4(0);
      }

      return vec4(1);
    }
  `),

  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_resolution) * 0.5 - 0.5;
      float radius = min(u_resolution.x, u_resolution.y) * 0.25;
      vec2 diff = gl_FragCoord.xy - center;

      if ((abs(diff.x) < 0.9 || abs(diff.y) < 0.9) && length(diff) < radius) {
        return vec4(1);
      }

      return vec4(0);
    }
  `),
}

export const Demo3: FC<DemoProps> = ({ width, height, scale }) => {
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
