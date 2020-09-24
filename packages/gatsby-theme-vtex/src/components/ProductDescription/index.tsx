import { ProductDescription } from '@vtex/store-ui'
import React, { FC } from 'react'

import useProductDescription from './useProductDescription'

interface Props {
  slug: string
}

const Specification: FC<Props> = ({ slug }) => {
  const specification = useProductDescription({ slug })

  return <ProductDescription {...specification} />
}

export default Specification
