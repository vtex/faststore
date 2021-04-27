import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { format, parse } from './priceRange'
import type { SearchPageContext } from '../../templates/search'
import { useRegion } from '../region/useRegion'

export interface SelectedFacets {
  key: string
  value: string
}

const searchParamsFromURL = (pathname: string, params: URLSearchParams) => {
  const smap = params.get('map')?.split(',')
  const spath = pathname.split('/').slice(1)

  if (smap === undefined) {
    throw new Error(
      `Search page does not have enough information to create search context from URL. Please add a 'map' querystring to the page`
    )
  }

  if (smap.length > spath.length) {
    throw new Error(
      `Invalid search querystring. There are more map params than segments on the path: (map: ${smap.join(
        ','
      )}, pathname: ${pathname}). `
    )
  }

  const selectedFacets = new Array<SelectedFacets>(smap.length)
  const squery = new Array<string>(smap.length)

  for (let it = smap.length - 1; it >= 0; it--) {
    squery[it] = spath[it + spath.length - squery.length]

    selectedFacets[it] = {
      key: smap[it],
      value: squery[it],
    }
  }

  return {
    query: squery.join('/'),
    map: smap.join(','),
    selectedFacets,
  }
}

export const useSearchFiltersFromPageContext = (
  pageContext: SearchPageContext
) => {
  const location = useLocation()
  const { regionId } = useRegion()
  const { search, pathname } = location
  const {
    query: pageContextQuery,
    map: pageContextMap,
    selectedFacets: pageContextSelectedFacets,
    staticPath: pageContextStaticPath,
    orderBy: pageContextOrderBy,
    hideUnavailableItems,
  } = pageContext

  return useMemo(() => {
    const params = new URLSearchParams(search)
    // Quick fix for some questions regarding memo dependencies
    /* eslint-disable-next-line prefer-destructuring */
    let query = pageContextQuery
    /* eslint-disable-next-line prefer-destructuring */
    let map = pageContextMap
    let selectedFacets = pageContextSelectedFacets! as Array<{
      key: string
      value: string
    }>

    /**
     *  Hydrates search context for dynamic search pages.
     */
    if (pageContextStaticPath === false) {
      const searchParams = searchParamsFromURL(pathname, params)

      query = searchParams.query
      map = searchParams.map
      selectedFacets = searchParams.selectedFacets
    }

    const fullText = map?.startsWith('ft') ? query?.split('/')[0] : undefined
    const orderBy = params.get('orderBy') ?? pageContextOrderBy ?? ''
    const maybePriceRange = params.get('priceRange')
    const priceRange = parse(maybePriceRange ?? '')

    if (priceRange !== null) {
      const value = format(priceRange)
      const range = selectedFacets.find((facet) => facet.key === 'priceRange')

      if (range !== undefined) {
        range.value = value
      } else {
        selectedFacets.push({
          key: 'priceRange',
          value,
        })
      }
    }

    if (regionId != null) {
      const region = selectedFacets.find((facet) => facet.key === 'region-id')

      if (region !== undefined) {
        region.value = regionId
      } else {
        selectedFacets.push({
          key: 'region-id',
          value: regionId,
        })
      }
    }

    return {
      orderBy,
      selectedFacets,
      fullText,
      priceRange,
      query,
      map,
      hideUnavailableItems,
    }
  }, [
    search,
    pageContextQuery,
    pageContextMap,
    pageContextSelectedFacets,
    pageContextStaticPath,
    pageContextOrderBy,
    regionId,
    hideUnavailableItems,
    pathname,
  ])
}
