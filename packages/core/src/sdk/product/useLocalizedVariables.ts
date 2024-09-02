import { ClientManyProductsQueryQueryVariables } from '@generated/graphql'
import { useMemo } from 'react'
import { ITEMS_PER_SECTION } from 'src/constants'
import { useSession } from '../session'

const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
}: Partial<ClientManyProductsQueryQueryVariables>) => {
  const { channel: sessionChannel, locale } = useSession()
  // It's not needed to send hasOnlyDefaultSalesChannel on the query,
  // so we remove it from the channel object to avoid unnecessary cache invalidations and query executions
  const { hasOnlyDefaultSalesChannel, ...filteredChannel } =
    JSON.parse(sessionChannel)
  const channel = JSON.stringify(filteredChannel)

  return useMemo(() => {
    const facets = toArray(selectedFacets)

    return {
      first: first ?? ITEMS_PER_SECTION,
      after: after ?? '0',
      sort: sort ?? ('score_desc' as const),
      term: term ?? '',
      selectedFacets: [
        ...facets,
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
    }
  }, [selectedFacets, first, after, sort, term, channel, locale])
}
