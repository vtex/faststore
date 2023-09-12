import { useMemo } from 'react'

import UIProductShelf from 'src/components/ui/ProductShelf'
import { useInView } from 'react-intersection-observer'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import styles from '../ProductShelf/section.module.scss'
import Section from '../Section'

interface Props {
  items: number
  title: string
  kind: 'buy' | 'view'
}

const CrossSellingShelf = ({ items: first, title, kind }: Props) => {
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
        first={first}
        title={title}
        selectedFacets={selectedFacets}
      />
    </Section>
  )
}

export default CrossSellingShelf
