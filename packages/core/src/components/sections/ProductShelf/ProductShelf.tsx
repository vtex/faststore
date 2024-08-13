import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import ProductShelf, {
  ProductShelfProps,
} from '../../../components/ui/ProductShelf'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { ProductShelfDefaultComponents } from './DefaultComponents'

function ProductShelfSection({
  ...otherProps
}: Omit<ProductShelfProps, 'inView'>) {
  const { ref, inView } = useInView()

  return (
    <Section className={`section-product-shelf layout__section`} ref={ref}>
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
