'use client'

import { useMemo } from 'react'

import UIProductShelf from 'app/components/ui/ProductShelf'
import { useInView } from 'react-intersection-observer'
import { usePDP } from 'app/sdk/overrides/PageProvider'
import styles from 'app/components/sections/ProductShelf/section.module.scss'
import Section from '../Section'
import { CrossSellingShelfDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from 'app/sdk/overrides/getOverriddenSection'

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
