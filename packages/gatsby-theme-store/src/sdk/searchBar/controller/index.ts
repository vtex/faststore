import { navigate } from '@reach/router'

import { slugify } from '../../../utils/slugify'
import { uniqBy } from '../../../utils/uniq'

const HISTORY_KEY = 'vtex:search-history'
const MAX_ITEMS = 10

export const history = {
  get: (): string[] => {
    if (navigator.cookieEnabled) {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    }

    return []
  },
  add: (term: string) => {
    const h = history.get()

    const updatedHistory = uniqBy([term, ...h].slice(0, MAX_ITEMS), (t) => t)

    if (navigator.cookieEnabled) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    }
  },
}

export type SearchHistory = typeof history

const pathExists = async (pathname: string) => {
  try {
    const response = await fetch(`/page-data${pathname}/page-data.json`, {
      redirect: 'error',
    })

    if (response.status !== 200) {
      return false
    }

    return true
  } catch (err) {
    return false
  }
}

/**
 * https://help.vtex.com/en/tutorial/how-does-vtex-search-work--tutorials_542#vtex-search-engine-product-display-prioritization
 *
 * To be compliant with "VTEX search engine product display prioritization" as described in the link above we implement the following
 * algorithm:
 *
 * 1. Make a call to the page's data object.
 * 2. If it exists, this means we Static Site Generated (SSG) a page for this search term and we should navigate there instead
 * 3. If it doesn't exist, we should fallback to a full text search instead
 *
 * This "VTEX search engine product display prioritization" is important because it allows our customers to create landing pages
 * for their most researched terms, crafting a custom experience for their best sellers.
 * A cool side effect of this approach is warming the browser's cache with the page's data object in case of the term having an
 * specific landing page
 */
export const search = async (term: string) => {
  let pathname = ''
  const params = new URLSearchParams(window.location.search)

  // Check if "term" has a more specific page
  const slugified = encodeURIComponent(slugify(term))
  const path = `/${slugified}`
  const exists = await pathExists(path)

  params.delete('map')
  if (exists) {
    // The page /slugified exists, let's navigate to this page
    pathname = `/${slugified}`
  } else {
    // There is no specific page for this term, let's make a full text search
    params.set('map', 'term')
    pathname = `/s/${encodeURIComponent(term)}`
  }

  history.add(term)

  navigate(`${pathname}?${params.toString()}`)
}
