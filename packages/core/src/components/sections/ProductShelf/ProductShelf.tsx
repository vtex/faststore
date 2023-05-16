import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import styles from './section.module.scss'
import UIProductShelf, {
  ProductShelfProps,
} from 'src/components/ui/ProductShelf'

function ProductShelf({ ...otherProps }: Omit<ProductShelfProps, 'inView'>) {
  const { ref, inView } = useInView()

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <UIProductShelf inView={inView} {...otherProps} />
    </Section>
  )
}

export default ProductShelf
