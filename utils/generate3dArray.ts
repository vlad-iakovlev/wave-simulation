export const generate3dArray = (
  iSize: number,
  jSize: number,
  kSize: number
) => {
  const array: number[][][] = []
  for (let i = 0; i < iSize; i++) {
    array[i] = []
    for (let j = 0; j < jSize; j++) {
      array[i][j] = []
      for (let k = 0; k < kSize; k++) {
        array[i][j][k] = 0
      }
    }
  }
  return array
}
