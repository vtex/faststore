import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import { ClientManyProductsQueryQuery } from '@generated/graphql'
import { memo } from 'react'
import { ProductCardProps } from 'src/components/product/ProductCard'
import { useGalleryPage } from 'src/sdk/product/usePageProductsQuery'

interface Props {
  page: number
  title: string
  productCard?: Pick<
    ProductCardProps,
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration'
  >
  itemsPerPage: number
  products: ClientManyProductsQueryQuery['search']['products']['edges']
  firstPage: number
}

function ProductGalleryPage({
  page,
  title,
  productCard,
  itemsPerPage,
  products: productsFallback,
  firstPage,
}: Props) {
  const { data } = useGalleryPage(page)

  const products = data?.search?.products?.edges ?? productsFallback ?? []

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
        firstPage={firstPage}
      />
    </>
  )
}

export default memo(ProductGalleryPage)
