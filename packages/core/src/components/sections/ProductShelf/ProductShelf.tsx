import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import ProductShelf, { ProductShelfProps } from 'src/components/ui/ProductShelf'
import styles from './section.module.scss'
import { ProductShelfDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

function ProductShelfSection({
  ...otherProps
}: Omit<ProductShelfProps, 'inView'>) {
  const { ref, inView } = useInView()
  console.timeEnd('Execution time ' + `ProductShelf`)

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <ProductShelf inView={inView} {...otherProps} />
    </Section>
  )
}

const OverridableProductShelf = getOverridableSection(
  'ProductShelf',
  ProductShelfSection,
  ProductShelfDefaultComponents
)

export default OverridableProductShelf
