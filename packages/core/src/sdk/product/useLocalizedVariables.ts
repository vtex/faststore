import { useMemo } from 'react'
import deepmerge from 'deepmerge'

import { useSearch, type SearchState } from '@faststore/sdk'
import type { ClientManyProductsQueryQueryVariables } from '@generated/graphql'

import { useSession } from 'src/sdk/session'
import { ITEMS_PER_SECTION } from 'src/constants'

const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

// Array merging strategy from deepmerge that makes client arrays overwrite server array
const overwriteMerge = (_: any[], clientArray: any[]) => clientArray

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

  const mergedSelectedFacets = deepmerge(
    selectedFacets as SearchState['selectedFacets'],
    searchState.selectedFacets,
    {
      arrayMerge: overwriteMerge,
    }
  )

  return useMemo(() => {
    return {
      first: first ?? ITEMS_PER_SECTION,
      after: after ?? '0',
      sort: sort ?? ('score_desc' as const),
      term: term ?? '',
      selectedFacets: [
        ...mergedSelectedFacets,
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
      sponsoredCount: sponsoredCount ?? 3,
    }
  }, [
    mergedSelectedFacets,
    first,
    after,
    sort,
    term,
    channel,
    locale,
    sponsoredCount,
  ])
}
