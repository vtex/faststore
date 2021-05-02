import { useLocation } from '@reach/router'
import type { ComponentPropsWithoutRef } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'

import type { ProductPageProps } from '../../../templates/product'

type Options = ProductPageProps

type Return = Pick<
  ComponentPropsWithoutRef<typeof GatsbySeo>,
  'canonical' | 'noindex' | 'nofollow'
>

export const useCanonical = (_: Options): Return => {
  const { pathname, host } = useLocation()

  return { canonical: `https://${host}${pathname}` }
}
