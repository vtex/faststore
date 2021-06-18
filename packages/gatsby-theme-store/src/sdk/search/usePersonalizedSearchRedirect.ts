import { formatSearchParamsState } from '@vtex/store-sdk'
import { navigate } from 'gatsby'
import type { SearchParamsState } from '@vtex/store-sdk'

import { useRegion } from '../region/useRegion'

type Options = SearchParamsState

/**
 * @description When the user has a personalized search, we can't allow it to see the
 * default search product results. The way we do it today is by navigating to a client-side
 * rendered page. We do this by adding a new param to the path
 *
 * TODO: find a solution for not having to do these navigations on the client-side
 */
export const usePersonalizedSearchRedirect = (searchParams: Options) => {
  const { regionId } = useRegion()

  if (regionId == null || searchParams.personalized === true) {
    return false
  }

  const { pathname, search } = formatSearchParamsState({
    ...searchParams,
    personalized: true,
  })

  navigate(`${pathname}${search}`, { replace: true })

  return true
}
