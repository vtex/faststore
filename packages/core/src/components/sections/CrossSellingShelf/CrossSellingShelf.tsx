import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import ProductShelf from '../ProductShelf'

interface Props {
  items: number
  title: string
  context: ProductDetailsFragment_ProductFragment
  kind: 'buy' | 'view'
}

const CrossSellingShelf = ({ items, title, context, kind }: Props) => {
  const selectedFacets = useMemo(
    () => [{ key: kind, value: context.isVariantOf.productGroupID }],
    [kind, context.isVariantOf.productGroupID]
  )

  return (
    <ProductShelf first={items} title={title} selectedFacets={selectedFacets} />
  )
}

export default CrossSellingShelf
