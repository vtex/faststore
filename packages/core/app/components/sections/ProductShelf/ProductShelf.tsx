'use client'

import Section from 'app/components/sections/Section/Section'
import { useInView } from 'react-intersection-observer'

import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import ProductShelf, { ProductShelfProps } from '../../ui/ProductShelf'
import { ProductShelfDefaultComponents } from './DefaultComponents'
import styles from './section.module.scss'

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
