export function isUndefined(target: unknown) {
  return target === undefined
}

export function isNotUndefined(target: unknown) {
  return !isUndefined(target)
}

export function isNull(target: unknown) {
  return target === null
}

export function isNotNull(target: unknown) {
  return !isNull(target)
}
