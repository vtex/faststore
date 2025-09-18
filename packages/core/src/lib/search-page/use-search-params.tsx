import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type { SearchState } from '@vtex/faststore-sdk'
import { formatSearchState, parseSearchState } from '@vtex/faststore-sdk'

export function useSearchParams(params: UseSearchParams) {
  const { sort: defaultSort } = params
  const { asPath } = useRouter()

  return useMemo(() => {
    const url = new URL(asPath, 'http://localhost')

    const shouldUpdateDefaultSort = defaultSort && !url.searchParams.has('sort')
    if (shouldUpdateDefaultSort) {
      url.searchParams.set('sort', defaultSort)
    }

    const newState = parseSearchState(url)
    const hrefState = formatSearchState(newState).href
    return parseSearchState(new URL(hrefState))
  }, [asPath, defaultSort])
}

interface UseSearchParams {
  sort: SearchState['sort']
}
