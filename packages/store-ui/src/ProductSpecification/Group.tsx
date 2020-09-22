import React, { FC, Fragment } from 'react'

import { ProductSpecificationItem } from './Item'
import { ProductSpecificationTitle } from './Title'

interface ProductSpecificationGroup {
  name?: string
  specifications?: Specification[]
}

interface Specification {
  name?: string
  values?: string[]
}

interface ProductSpecificationProps {
  variant?: string
  data?: ProductSpecificationGroup[]
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
