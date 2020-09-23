import { ProductSpecification } from '@vtex/store-ui'
import React, { FC } from 'react'

import useProductSpecification from './useProductSpecification'

interface Props {
  slug: string
}

const Specification: FC<Props> = ({ slug }) => {
  const specification = useProductSpecification({ slug })

  return <ProductSpecification {...specification} />
}

export default Specification
