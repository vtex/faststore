export interface PriceRange {
  from: number
  to: number
}

export const parse = (priceRange: string) => {
  const [fromStr, toStr] = priceRange.split(' TO ')
  const from = Number(fromStr)
  const to = Number(toStr)

  if (Number.isNaN(from) === false && Number.isNaN(to) === false && from < to) {
    return {
      from,
      to,
    }
  }

  return null
}

export const format = ({ from, to }: PriceRange) => {
  if (typeof from === 'number' && typeof to === 'number') {
    return `${from} TO ${to}`
  }

  throw new Error(
    '[store-sdk]: Error while formatting PriceRanges. Expected type number'
  )
}
