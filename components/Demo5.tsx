import { FC, useCallback, useRef } from 'react'
import { FieldImage, FieldImageShaders, getShader } from '../classes/FieldImage'
import { useFullscreenOnSpace } from '../hooks/useFullscreenOnSpace'
import { useRaf } from '../hooks/useRaf'
import { useResize } from '../hooks/useResize'

const initShaders: FieldImageShaders = {
  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_resolution) * 0.5 - 0.5;
      float radius = min(u_resolution.x, u_resolution.y) * 0.25;
      float len = length(gl_FragCoord.xy - center) / radius;

      if (len < 1.0) {
        return vec4(cos(len * 5.0 * M_PI) * (1.0 - len) * 2.0);
      }

      return vec4(0);
    }
  `),
}

export const Demo5: FC = () => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(initShaders)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      fieldImage.current.iterate()
      fieldImage.current.iterate()
      fieldImage.current.draw('height')
    }, [])
  )

  useResize(
    useCallback(() => {
      fieldImage.current = undefined
    }, [])
  )

  useFullscreenOnSpace(root)

  return <div ref={root} />
}
