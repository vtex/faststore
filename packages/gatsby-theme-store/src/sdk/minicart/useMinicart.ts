import { useContext } from 'react'

import { Context } from './Provider'

export const useMinicart = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error(
      `[gatsby-theme-store]: Minicart context needs to be in the react tree`
    )
  }

  return context
}
