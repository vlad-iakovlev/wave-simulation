import { FC, useCallback, useRef } from 'react'
import {
  FieldImage,
  FieldImageUserShaders,
  getShader,
} from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { useResize } from '../hooks/useResize'

const userShaders: FieldImageUserShaders = {
  mass: getShader(`
    vec4 calc() {
      if (u_frame == 0) {
        vec2 center = vec2(u_dimensions) * 0.5 - 0.5;
        float radius = min(u_dimensions.x, u_dimensions.y) * 0.25;

        if (
          abs(gl_FragCoord.x - floor(center.x - radius * 1.3) + 1.5) < 0.001 &&
          gl_FragCoord.y < center.y + radius * 0.7 &&
          gl_FragCoord.y > center.y + radius * 0.5
        ) {
          return vec4(0);
        }

        if (length(gl_FragCoord.xy - center) < radius) {
          return vec4(0.7);
        }
      }

      return texelFetch(u_mass, ivec2(gl_FragCoord.xy), 0);
    }
  `),

  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_dimensions) * 0.5 - 0.5;
      float radius = min(u_dimensions.x, u_dimensions.y) * 0.25;

      if (
        abs(gl_FragCoord.x - floor(center.x - radius * 1.3) + 0.5) < 0.001 &&
        gl_FragCoord.y < center.y + radius * 0.7 &&
        gl_FragCoord.y > center.y + radius * 0.5
      ) {
        return vec4(sin(float(u_frame) * M_PI * 0.25));
      }

      return texelFetch(u_height, ivec2(gl_FragCoord.xy), 0);
    }
  `),
}

export const Demo2: FC = () => {
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
      fieldImage.current.draw('height')
    }, [])
  )

  useResize(
    useCallback(() => {
      fieldImage.current = undefined
    }, [])
  )

  return <div ref={root} />
}
