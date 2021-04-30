/** @jsx jsx */
import { jsx } from 'theme-ui'
import type { ComponentPropsWithoutRef, FC } from 'react'

import LocalizedLink from '../LocalizedLink/index'

type LocalizedLinkProps = ComponentPropsWithoutRef<typeof LocalizedLink>

interface Props extends LocalizedLinkProps {
  variant: string
}

const ProductSummaryContainer: FC<Props> = ({ children, variant, ...rest }) => (
  <LocalizedLink
    {...rest}
    state={{ fromSummary: true }}
    sx={{
      variant: `productSummary.${variant}.container`,
    }}
  >
    {children}
  </LocalizedLink>
)

export default ProductSummaryContainer
