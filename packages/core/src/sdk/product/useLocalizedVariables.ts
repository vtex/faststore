import { useMemo } from 'react'
import { ClientManyProductsQueryQueryVariables } from '@generated/graphql'
import { useSession } from '../session'
import { ITEMS_PER_SECTION } from 'src/constants'

const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
}: Partial<ClientManyProductsQueryQueryVariables>) => {
  const { channel, locale } = useSession()

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
