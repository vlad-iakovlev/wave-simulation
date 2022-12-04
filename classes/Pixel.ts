export type PixelValueSource = 'height' | 'accumulated'

export class Pixel {
  mass = 1
  height = 0
  velocity = 0
  accumulated = 0
  massShift = 0

  iterateHeight() {
    this.height += this.velocity
  }

  iterateAccumulated() {
    this.accumulated += Math.abs(this.height)
  }

  iterateVelocity(adjacentPixels: Pixel[]) {
    if (!Number.isFinite(this.mass) || !adjacentPixels.length) {
      return
    }

    const speed = 1 / this.mass - this.massShift

    const force =
      adjacentPixels.reduce((acc, pixel) => acc + pixel.height, 0) /
      adjacentPixels.length

    this.velocity += (force - this.height) * speed
  }

  getValue(source: PixelValueSource) {
    switch (source) {
      case 'height':
        return Math.max(0, Math.min(1, this.height))

      case 'accumulated':
        return Math.pow(Math.min(1, this.accumulated * 0.0005), 2)

      default:
        return 0
    }
  }
}
