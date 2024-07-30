'use client'

import { useMemo } from 'react'

import styles from 'app/components/sections/ProductShelf/section.module.scss'
import Section from 'app/components/sections/Section'
import UIProductShelf from 'app/components/ui/ProductShelf'
import { getOverridableSection } from 'app/sdk/overrides/getOverriddenSection'
import { usePDP } from 'app/sdk/overrides/PageProvider'
import { useInView } from 'react-intersection-observer'
import { CrossSellingShelfDefaultComponents } from './DefaultComponents'

interface Props {
  numberOfItems: number
  itemsPerPage?: number
  title: string
  kind: 'buy' | 'view'
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
}
const CrossSellingShelf = ({
  numberOfItems,
  itemsPerPage,
  title,
  kind,
  taxesConfiguration,
}: Props) => {
  const { ref, inView } = useInView()
  const context = usePDP()
  const productGroupID = context?.data?.product?.isVariantOf?.productGroupID

  const selectedFacets = useMemo(
    () => [{ key: kind, value: productGroupID }],
    [kind, productGroupID]
  )

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <UIProductShelf
        inView={inView}
        numberOfItems={numberOfItems}
        itemsPerPage={itemsPerPage}
        title={title}
        selectedFacets={selectedFacets}
        taxesConfiguration={taxesConfiguration}
      />
    </Section>
  )
}

const OverridableCrossSellingShelf = getOverridableSection<
  typeof CrossSellingShelf
>('CrossSellingShelf', CrossSellingShelf, CrossSellingShelfDefaultComponents)

export default OverridableCrossSellingShelf
