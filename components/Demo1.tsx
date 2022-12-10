import { FC, useCallback, useRef } from 'react'
import { FieldImage, FieldImageShaders, getShader } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'
import { useResize } from '../hooks/useResize'

const initShaders: FieldImageShaders = {
  height: getShader(`
    vec4 calc() {
      vec2 center = vec2(u_dimensions) * 0.5 - 0.5;
      float radius = min(u_dimensions.x, u_dimensions.y) * 0.25;

      if (length(gl_FragCoord.xy - center) < radius) {
        return vec4(1);
      }

      return vec4(0);
    }
  `),
}

export const Demo1: FC = () => {
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

  return <div ref={root} />
}
