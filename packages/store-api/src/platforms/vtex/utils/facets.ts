export interface SelectedFacet {
  key: string
  value: string
}

const getIdFromSlug = (slug: string) => {
  const id = slug.split('-').pop()

  if (id == null) {
    throw new Error('Error while extracting sku id from product slug')
  }

  return id
}

/**
 * Transform facets from the store to VTEX platform facets.
 * For instance, the channel in Store becames trade-policy in VTEX's realm
 * */
export const transformSelectedFacet = ({ key, value }: SelectedFacet) => {
  switch (key) {
    case 'channel':
      return { key: 'trade-policy', value }

    case 'slug':
      return { key: 'id', value: getIdFromSlug(key) }

    default:
      return { key, value }
  }
}
