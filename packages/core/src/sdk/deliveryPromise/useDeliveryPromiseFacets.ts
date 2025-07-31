import { useSearch } from '@faststore/sdk'

export function useDeliveryPromiseFacets() {
  const { state: searchState } = useSearch()

  return {
    allFacets: searchState.selectedFacets.filter(
      pickByKey(['shipping', 'pickupPoint'])
    ),
    shipping: searchState.selectedFacets.filter(pickByKey(['shipping']))?.[0],
    pickupPoint: searchState.selectedFacets.filter(
      pickByKey(['pickupPoint'])
    )?.[0],
  }
}

const pickByKey =
  (keys: Array<string>) =>
  ({ key }: { key: string }) =>
    keys.includes(key)
