import { useMemo } from 'react'

import UIProductShelf from '../../../components/ui/ProductShelf'
import { useInView } from 'react-intersection-observer'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import styles from '../ProductShelf/section.module.scss'
import Section from '../Section'
import { CrossSellingShelfDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'

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

CrossSellingShelf.$componentKey = 'CrossSellingShelf'

const OverridableCrossSellingShelf = getOverridableSection<
  typeof CrossSellingShelf
>('CrossSellingShelf', CrossSellingShelf, CrossSellingShelfDefaultComponents)

export default OverridableCrossSellingShelf
