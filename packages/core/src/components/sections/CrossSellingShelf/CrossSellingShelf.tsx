import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import UIProductShelf from 'src/components/ui/ProductShelf'
import { useInView } from 'react-intersection-observer'
import styles from '../ProductShelf/section.module.scss'
import Section from '../Section'

interface Props {
  items: number
  title: string
  context: ProductDetailsFragment_ProductFragment
  kind: 'buy' | 'view'
}

const CrossSellingShelf = ({ items, title, context, kind }: Props) => {
  const { ref, inView } = useInView()

  const selectedFacets = useMemo(
    () => [{ key: kind, value: context.isVariantOf.productGroupID }],
    [kind, context.isVariantOf.productGroupID]
  )

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <UIProductShelf
        inView={inView}
        first={items}
        title={title}
        selectedFacets={selectedFacets}
      />
    </Section>
  )
}

export default CrossSellingShelf
