import { FC, useCallback, useRef } from 'react'
import {
  FieldImage,
  FieldImageUserShaders,
  getShader,
} from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { useResize } from '../hooks/useResize'

const userShaders: FieldImageUserShaders = {
  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_dimensions) * 0.5 - 0.5;
      float radius = min(u_dimensions.x, u_dimensions.y) * 0.25;
      vec2 diff = gl_FragCoord.xy - center;

      if ((abs(diff.x) < 0.9 || abs(diff.y) < 0.9) && length(diff) < radius) {
        return vec4(sin(float(u_frame) * M_PI * 0.4));
      }

      return texelFetch(u_height, ivec2(gl_FragCoord.xy), 0);
    }
  `),
}

export const Demo4: FC = () => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(userShaders)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      fieldImage.current.iterate()
      fieldImage.current.iterate()
      fieldImage.current.draw()
    }, [])
  )

  useResize(
    useCallback(() => {
      fieldImage.current = undefined
    }, [])
  )

  return <div ref={root} />
}
