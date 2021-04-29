import { navigate } from 'gatsby'
import { useLocation } from '@reach/router'
import { useContext } from 'react'

import { Context } from '../region/Provider'

interface Options {
  map: Maybe<string>
}

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
