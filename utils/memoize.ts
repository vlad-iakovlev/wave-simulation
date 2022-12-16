export const memoize = <K, V>(getValue: (key: K) => V) => {
  const cache = new Map<K, V>()

  return (key: K) => {
    const valueFromCache = cache.get(key)
    if (valueFromCache !== undefined) return valueFromCache

    const value = getValue(key)
    cache.set(key, value)
    return value
  }
}
