export const generate2dArray = (iSize: number, jSize: number) => {
  const array: number[][] = []
  for (let i = 0; i < iSize; i++) {
    array[i] = []
    for (let j = 0; j < jSize; j++) {
      array[i][j] = 0
    }
  }
  return array
}
