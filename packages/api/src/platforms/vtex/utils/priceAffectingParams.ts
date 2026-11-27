export const followPriceAffectingParams = (
  value: string | null | undefined
): string | null => {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return null
}
