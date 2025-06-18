import { useMemo } from 'react'
import deepmerge from 'deepmerge'

import { useGlobalStateSearch as useSearch } from '@faststore/sdk'
import type { ClientManyProductsQueryQueryVariables } from '@generated/graphql'

import { useSession } from 'src/sdk/session'
import type { Facet } from '@faststore/sdk'

import { ITEMS_PER_SECTION } from 'src/constants'

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
      deepmerge(selectedFacets as Facet[], searchState.selectedFacets)
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
