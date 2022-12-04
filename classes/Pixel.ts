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

  iterateVelocity(force: number) {
    if (!Number.isFinite(this.mass)) return
    const speed = 1 / this.mass - this.massShift
    this.velocity += (force - this.height) * speed
  }

  getValue(source: PixelValueSource) {
    switch (source) {
      case 'height': {
        if (this.height < 0) return 0
        if (this.height > 1) return 1
        return this.height
      }

      case 'accumulated': {
        const accumulatedNormalized = this.accumulated * 0.0005
        if (accumulatedNormalized > 1) return 1
        return accumulatedNormalized * accumulatedNormalized
      }

      default:
        return 0
    }
  }
}
