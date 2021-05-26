import { useLocation } from '@reach/router'
import { parseSearchParamsState } from '@vtex/store-sdk'
import { useMemo } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'

export interface SelectedFacets {
  key: string
  value: string
}

/**
 * @description: Hydrates search context for dynamic search pages.
 */
export const useSearchParamsFromUrl = (): SearchParamsState => {
  const { href } = useLocation()

  return useMemo(() => parseSearchParamsState(new URL(href)), [href])
}
