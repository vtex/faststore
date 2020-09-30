import React, { FC } from 'react'

export interface ProductDescriptionProps {
  data?: any
}

export const ProductDescription: FC<ProductDescriptionProps> = ({
  data = 'productDescription',
}) => <div dangerouslySetInnerHTML={{ __html: data }} />
