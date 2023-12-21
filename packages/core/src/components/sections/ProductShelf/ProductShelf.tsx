import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import ProductShelf, { ProductShelfProps } from 'src/components/ui/ProductShelf'
import styles from './section.module.scss'
import { ProductShelfDefaultComponents } from './DefaultComponents'
import { DefaultComponentsProvider } from 'src/sdk/overrides/OverrideContext'

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

function ProductShelfWithDefaultComponents(
  props: React.ComponentProps<typeof ProductShelfSection>
) {
  return (
    <DefaultComponentsProvider value={ProductShelfDefaultComponents}>
      <ProductShelfSection {...props} />
    </DefaultComponentsProvider>
  )
}

export default ProductShelfWithDefaultComponents
