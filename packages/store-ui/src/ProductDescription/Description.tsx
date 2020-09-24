import React, { FC } from 'react'

export interface ProductDescriptionDescriptionProps {
  data?: any
}

export const ProductDescriptionDescription: FC<ProductDescriptionDescriptionProps> = ({
  data = 'productDescription',
}) => <div dangerouslySetInnerHTML={{ __html: data }} />
