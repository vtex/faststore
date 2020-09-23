import React, { FC, Fragment } from 'react'

import { ProductSpecificationItem } from './Item'
import { ProductSpecificationTitle } from './Title'

export interface ProductSpecification {
  name?: string
  values?: string[]
}

export interface ProductSpecificationGroup {
  name?: string
  specifications?: ProductSpecification[]
}

interface ProductSpecificationProps {
  variant?: string
  data?: ProductSpecificationGroup[] | null
}

export const ProductSpecification: FC<ProductSpecificationProps> = ({
  variant = 'productSpecification',
  data,
}) => (
  <>
    {data?.map((group) => (
      <Fragment key={group?.name}>
        <ProductSpecificationTitle variant={variant}>
          {group?.name}
        </ProductSpecificationTitle>
        <ProductSpecificationItem
          variant={variant}
          data={group?.specifications}
        />
      </Fragment>
    ))}
  </>
)
