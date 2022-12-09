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

      if (u_frame == 0) {
        if (sqrt(pow(gl_FragCoord.x - center.x, 2.0) + pow(gl_FragCoord.y - center.y, 2.0)) < radius) {
          return vec4(1, 1, 1, 0);
        }
      }

      return texelFetch(u_height, ivec2(gl_FragCoord.xy), 0);
    }
  `),
}

export const Demo1: FC = () => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback((fps) => {
      if (!fieldImage.current) {
        fieldImage.current = new FieldImage(userShaders)

        while (root.current?.firstChild) {
          root.current.removeChild(root.current.firstChild)
        }
        root.current?.appendChild(fieldImage.current.canvas)
      }

      fieldImage.current.iterate()
      // If FPS less then 100 iterate one more time to make animation faster
      if (fps < 100) fieldImage.current.iterate()
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
