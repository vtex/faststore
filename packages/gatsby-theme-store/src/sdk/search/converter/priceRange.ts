export interface PriceRange {
  from: number
  to: number
}

const parser = (splitter: string) => (range: string) => {
  const [fromStr, toStr] = range.split(splitter)
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

const formatter = (splitter: string) => ({ from, to }: PriceRange) => {
  if (typeof from === 'number' && typeof to === 'number') {
    return `${from.toFixed(2)}${splitter}${to.toFixed(2)}`
  }

  throw new Error('cannot format price range')
}

export const priceRange = {
  parseQuery: parser(' TO'), // TODO: remove this once we have a graphql layer
  formatQuery: formatter(' TO '), // TODO: remove this once we have a graphql layer
  parseUrl: parser('-to-'),
  formatUrl: formatter('-to-'),
}
