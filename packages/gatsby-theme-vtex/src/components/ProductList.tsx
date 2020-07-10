/** @jsx jsx */
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import { ProductSummary } from './ProductSummary'
import { StaticProduct, DynamicProduct } from './Shapes'

interface Props {
  staticProducts: StaticProduct[]
  dynamicProducts: DynamicProduct[]
}

export const ProductList: FC<Props> = ({ staticProducts, dynamicProducts }) => {
  return (
    <Fragment>
      {staticProducts.map((staticProduct, index) => (
        <Link
          key={staticProduct.id}
          to={staticProduct.slug}
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          <ProductSummary
            staticProduct={staticProduct}
            lazyLoad={index > 3}
            dynamicProduct={dynamicProducts[index]}
          />
        </Link>
      ))}
      {dynamicProducts.length > staticProducts.length &&
        dynamicProducts.slice(staticProducts.length).map((dynamicProduct) => (
          <Link
            key={dynamicProduct.id}
            to={dynamicProduct.slug}
            sx={{
              textDecoration: 'none',
              color: 'text',
            }}
          >
            <ProductSummary
              staticProduct={dynamicProduct}
              lazyLoad
              dynamicProduct={dynamicProduct}
            />
          </Link>
        ))}
    </Fragment>
  )
}
