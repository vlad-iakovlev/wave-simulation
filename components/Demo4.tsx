import { FC, useCallback, useRef } from 'react'
import { FieldImage, FieldImageShaders, getShader } from '../classes/FieldImage'
import { useFullscreenOnSpace } from '../hooks/useFullscreenOnSpace'
import { useRaf } from '../hooks/useRaf'
import { useResize } from '../hooks/useResize'

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
      float radius = min(u_resolution.x, u_resolution.y) * 0.25;
      vec2 diff = gl_FragCoord.xy - center;

      if (
        length(diff + u_resolution * vec2( 0.25,  0.25)) < radius * 0.5 ||
        length(diff + u_resolution * vec2( 0.25, -0.25)) < radius * 0.5 ||
        length(diff + u_resolution * vec2(-0.25,  0.25)) < radius * 0.5 ||
        length(diff + u_resolution * vec2(-0.25, -0.25)) < radius * 0.5
      ) {
        return vec4(1);
      }

      return vec4(0);
    }
  `),
}

export const Demo4: FC = () => {
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
