import type { ClientManyProductsQueryQueryVariables } from '@generated/graphql'
import { useMemo } from 'react'
import { ITEMS_PER_SECTION } from 'src/constants'
import { useSession } from '../session'
import { useSearch, type SearchState } from '@faststore/sdk'
import deepmerge from 'deepmerge'

const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
  sponsoredCount,
}: Partial<ClientManyProductsQueryQueryVariables>) => {
  const { channel, locale } = useSession()
  const { state: searchState } = useSearch()

  return useMemo(() => {
    const facets = toArray(
      deepmerge(
        selectedFacets as SearchState['selectedFacets'],
        searchState.selectedFacets
      )
    )

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
      sponsoredCount: sponsoredCount ?? 3,
    }
  }, [
    selectedFacets,
    first,
    after,
    sort,
    term,
    channel,
    locale,
    sponsoredCount,
  ])
}
