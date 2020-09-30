/** @jsx jsx */
import { FC } from 'react'
import { LocalizedLink, jsx } from '@vtex/store-ui'

interface Props {
  linkText: string
  variant?: string
}

const ProductSummaryContainer: FC<Props> = ({
  children,
  linkText,
  variant = 'productSummary',
}) => (
  <LocalizedLink
    state={{ fromSummary: true }}
    to={`/${linkText}/p`}
    sx={{
      variant: `${variant}.container`,
      textDecoration: 'none',
      color: 'text',
      flexGrow: 1,
    }}
  >
    {children}
  </LocalizedLink>
)

export default ProductSummaryContainer
