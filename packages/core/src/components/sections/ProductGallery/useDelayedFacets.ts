import { useMemo, useRef } from 'react'

import type {
  Filter_FacetsFragment,
  ProductGalleryQueryQuery,
} from '@generated/graphql'

export const useDelayedFacets = (data?: ProductGalleryQueryQuery) => {
  const facets = useRef<Filter_FacetsFragment[]>([])

  return useMemo(() => {
    if (data) {
      facets.current = data.search.facets
    }

    return facets.current
  }, [data, facets])
}
