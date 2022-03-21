export interface SelectedFacet {
  key: string
  value: string
}

/**
 * Transform facets from the store to VTEX platform facets.
 * For instance, the channel in Store becames trade-policy in VTEX's realm
 * */
export const transformSelectedFacet = ({ key, value }: SelectedFacet) => {
  switch (key) {
    case 'channel':
      return { key: 'trade-policy', value }

    default:
      return { key, value }
  }
}
