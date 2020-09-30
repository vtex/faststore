/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'

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
