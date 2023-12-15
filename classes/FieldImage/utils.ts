import { TEXTURE_NAMES } from './constants.js'

export const getShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    const float M_PI = radians(180.0);
    const vec4 DEFAULT_ACCELERATION = vec4(1.02, 1, 0.96, 0);

    ${TEXTURE_NAMES.map((textureName) => {
      return `uniform sampler2D u_${textureName};`
    }).join('\n')}
    uniform vec2 u_resolution;

    ${TEXTURE_NAMES.map((textureName, index) => {
      return `layout(location = ${index}) out vec4 o_${textureName};`
    }).join('\n')}

    ${code}
  `
}

export const getDrawShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    ${TEXTURE_NAMES.map((textureName) => {
      return `uniform sampler2D u_${textureName};`
    }).join('\n')}
    uniform vec2 u_resolution;

    out vec4 o_color;

    ${code}
  `
}
