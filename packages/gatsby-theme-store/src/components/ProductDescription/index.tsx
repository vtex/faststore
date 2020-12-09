import { ProductDescription, ProductDescriptionTitle } from '@vtex/store-ui'
import React, { Fragment } from 'react'
import type { FC } from 'react'

import useProductDescription from './useProductDescription'

interface Props {
  slug: string
}

const Description: FC<Props> = ({ slug }) => {
  const description = useProductDescription({ slug })

  return (
    <Fragment>
      <ProductDescriptionTitle>Description</ProductDescriptionTitle>
      <ProductDescription {...description} />
    </Fragment>
  )
}

export default Description
