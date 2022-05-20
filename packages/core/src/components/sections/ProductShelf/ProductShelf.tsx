import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title: string | JSX.Element
  withDivisor?: boolean
  suspense?: boolean
}

function ProductShelf({
  title,
  withDivisor = false,
  suspense,
  ...variables
}: ProductShelfProps) {
  const products = useProductsQuery(variables, { suspense })

  if (products?.edges.length === 0) {
    return null
  }

  return (
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''}`}
    >
      <h2 className="text__title-section layout__content">{title}</h2>
      <div data-fs-product-shelf>
        <ProductShelfSkeleton loading={products === undefined}>
          <ul data-fs-product-shelf-items className="layout__content">
            {products?.edges.map((product, idx) => (
              <li key={`${product.node.id}`}>
                <ProductCard product={product.node} index={idx + 1} />
              </li>
            ))}
          </ul>
        </ProductShelfSkeleton>
      </div>
    </Section>
  )
}

export default ProductShelf
