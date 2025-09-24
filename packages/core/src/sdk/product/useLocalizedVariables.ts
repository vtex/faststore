import { useMemo } from 'react'

import type { ClientManyProductsQueryQueryVariables } from '../../../@generated/graphql'

import { ITEMS_PER_SECTION } from '../../constants'
import { toArray } from '../../utils/utilities'
import { useSession } from '../session'

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
  sponsoredCount,
}: Partial<ClientManyProductsQueryQueryVariables>) => {
  const { channel, locale } = useSession()

  return useMemo(() => {
    return {
      first: first ?? ITEMS_PER_SECTION,
      after: after ?? '0',
      sort: sort ?? ('score_desc' as const),
      term: term ?? '',
      selectedFacets: [
        ...toArray(selectedFacets),
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
