export const priceAffectingParamsStamp = Symbol('priceAffectingParams')

export const followPriceAffectingParams = (
  value: string | null | undefined
): string | null => {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return null
}

export const stampPriceAffectingParams = <T extends object>(
  value: T,
  params: string | null
): T => {
  if (params === null) {
    return value
  }

  return {
    ...value,
    [priceAffectingParamsStamp]: params,
  } as T
}

export const readPriceAffectingParamsStamp = (
  value: object | null | undefined
): string | null => {
  if (value == null) {
    return followPriceAffectingParams(null)
  }

  const stamped = (value as Record<symbol, unknown>)[priceAffectingParamsStamp]

  if (typeof stamped === 'string' || stamped == null) {
    return followPriceAffectingParams(stamped)
  }

  return followPriceAffectingParams(null)
}
