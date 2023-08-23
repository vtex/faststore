import { useInView } from 'react-intersection-observer'
import Section from '../Section'

import ProductShelf from 'src/components/ui/ProductShelf'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import styles from './section.module.scss'

type Sort =
  | 'discount_desc'
  | 'name_asc'
  | 'name_desc'
  | 'orders_desc'
  | 'price_asc'
  | 'price_desc'
  | 'release_desc'
  | 'score_desc'

export type ProductShelfProps = {
  title: string
  first?: number
  after?: string
  sort?: Sort
  term?: string
  selectedFacets?: {
    key: string
    value: string
  }[]
  productCardConfiguration?: {
    showDiscountBadge?: boolean
    bordered?: boolean
  }
}

function ProductShelfSection(props: ProductShelfProps) {
  const { ref, inView } = useInView()
  const { first, after, sort, term, selectedFacets, ...otherProps } = props
  const data = useProductsQuery({ first, after, sort, term, selectedFacets })
  const products = data?.search?.products

  return (
    <Section
      className={`${styles.section} section-product-shelf layout__section`}
      ref={ref}
    >
      <ProductShelf inView={inView} products={products} {...otherProps} />
    </Section>
  )
}

export default ProductShelfSection
