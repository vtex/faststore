import { navigate } from 'gatsby'
import { useLocation } from '@reach/router'
import { useContext } from 'react'

import { Context } from '../region/Provider'

interface Options {
  map: Maybe<string>
}

/**
 * @description When the user has a regionId set, we can't allow it to see other region's
 * products. The way we do it today is by navigating to a client-side rendered page by faking
 * some map and pathname arguments.
 *
 * TODO: find a solution for not having to do these navigations
 * */
export const useRegionalizedSearch = (
  { map }: Options,
  staticPath: boolean
) => {
  const { pathname } = useLocation()
  const region = useContext(Context)

  if (region?.regionId === undefined || staticPath !== true) {
    return
  }

  const newMap = map == null ? 'region' : `${map},region`
  const to = `${pathname}/rId?map=${newMap}`

  navigate(to)
}
