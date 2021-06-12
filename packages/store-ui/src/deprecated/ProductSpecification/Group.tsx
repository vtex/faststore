import React, { Fragment } from 'react'
import type { FC } from 'react'

import { ProductSpecificationItem } from './Item'
import { ProductSpecificationTitle } from './Title'

export interface ProductSpecificationType {
  name?: string
  values?: string[]
}

export interface ProductSpecificationGroup {
  name?: string
  specifications?: ProductSpecificationType[]
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
