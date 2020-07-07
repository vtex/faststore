/** @jsx jsx */
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import { ProductSummary } from './ProductSummary'
import { SyncProductItem } from '../types/product'

interface Props {
  syncProducts: SyncProductItem[]
}

export const ProductList: FC<Props> = ({ syncProducts }) => {
  return (
    <Fragment>
      {syncProducts.map((syncProduct, index) => (
        <Link
          key={syncProduct.id}
          to={syncProduct.slug}
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          <ProductSummary
            syncProduct={syncProduct}
            lazyLoad={index > 3}
            index={index}
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
