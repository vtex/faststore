import { useMemo, useRef } from 'react'

import type {
  BrowserProductGalleryQueryQuery,
  Filter_FacetsFragment,
} from '@generated/graphql'

export const useDelayedFacets = (data?: BrowserProductGalleryQueryQuery) => {
  const facets = useRef<Filter_FacetsFragment[]>([])

  return useMemo(() => {
    if (data) {
      facets.current = data.search.facets
    }

    return facets.current
  }, [data, facets])
}
