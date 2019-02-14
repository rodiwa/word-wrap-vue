import { intersection } from 'lodash'

const currentSizeOptions = ['small', 'medium', 'large']

export const getCurrentSize = (itemClassName) => {
  return intersection(currentSizeOptions, itemClassName)[0]
}

export const getNextSize = (currentSize) => {
  let nextSize = currentSizeOptions.indexOf(currentSize)
  nextSize = nextSize === (currentSizeOptions.length - 1) ? 0 : ++nextSize
  return currentSizeOptions[nextSize]
}
