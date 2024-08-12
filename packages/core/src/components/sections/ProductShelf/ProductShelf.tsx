'use client'

import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import ProductShelf, {
  ProductShelfProps,
} from '../../../components/ui/ProductShelf'
import styles from './section.module.scss'
import { ProductShelfDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../../app/sdk/overrides/getOverriddenSection'

function ProductShelfSection({
  ...otherProps
}: Omit<ProductShelfProps, 'inView'>) {
  const { ref, inView } = useInView()

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <ProductShelf inView={inView} {...otherProps} />
    </Section>
  )
}

const OverridableProductShelf = getOverridableSection<typeof ProductShelf>(
  'ProductShelf',
  ProductShelfSection,
  ProductShelfDefaultComponents
)

export default OverridableProductShelf
