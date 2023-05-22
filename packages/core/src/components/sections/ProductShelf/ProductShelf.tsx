import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import styles from './section.module.scss'
import ProductShelf, { ProductShelfProps } from 'src/components/ui/ProductShelf'

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

export default ProductShelfSection
