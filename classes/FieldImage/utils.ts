import { TEXTURE_NAMES } from './constants'

export const getShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    const float M_PI = radians(180.0);

    ${TEXTURE_NAMES.map((textureName) => {
      return `uniform sampler2D u_${textureName};`
    }).join('\n')}
    uniform vec2 u_resolution;

    ${code}

    ${TEXTURE_NAMES.map((textureName, index) => {
      return `layout(location = ${index}) out vec4 o_${textureName};`
    }).join('\n')}

    void main() {
      o_mass = calcMass();
      o_height = calcHeight();
      o_velocity = calcVelocity();
      o_accumulated = calcAccumulated();
    }
  `
}

export const getDrawShader = (code: string) => {
  return `#version 300 es
    precision highp float;

    ${TEXTURE_NAMES.map((textureName) => {
      return `uniform sampler2D u_${textureName};`
    }).join('\n')}
    uniform vec2 u_resolution;

    ${code}

    out vec4 o_color;

    void main() {
      o_color = calcColor();
    }
  `
}
