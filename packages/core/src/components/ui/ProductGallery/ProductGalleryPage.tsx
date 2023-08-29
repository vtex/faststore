import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import { ProductCardProps } from 'src/components/product/ProductCard'
import { memo } from 'react'
import { useGalleryPage } from 'src/sdk/product/usePageProductsQuery'

interface Props {
  page: number
  title: string
  productCard?: Pick<ProductCardProps, 'showDiscountBadge' | 'bordered'>
  itemsPerPage: number
}

function ProductGalleryPage({ page, title, productCard, itemsPerPage }: Props) {
  const productsPerPage = useGalleryPage(page)

  const products = productsPerPage?.data?.search?.products?.edges ?? []

  return (
    <>
      <Sentinel
        products={products}
        page={page}
        pageSize={itemsPerPage}
        title={title}
      />
      <ProductGrid
        products={products}
        page={page}
        pageSize={itemsPerPage}
        productCard={productCard}
      />
    </>
  )
}

export default memo(ProductGalleryPage)
