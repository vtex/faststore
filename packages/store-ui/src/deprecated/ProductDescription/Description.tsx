/** @jsx jsx */
import { jsx } from 'theme-ui'
import type { FC } from 'react'

export interface ProductDescriptionProps {
  data?: any
  variant?: string
}

export const ProductDescription: FC<ProductDescriptionProps> = ({
  data,
  variant = 'productDescription',
}) => (
  <div
    dangerouslySetInnerHTML={{ __html: data }}
    sx={{ variant: `${variant}.description` }}
  />
)
