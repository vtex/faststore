import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

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
  firstPage: number
  shouldShowComparison?: boolean
}

function ProductGalleryPage({
  page,
  title,
  productCard,
  itemsPerPage,
  firstPage,
  shouldShowComparison,
}: Props) {
  const { data } = useGalleryPage(page)

  const products = data?.search?.products?.edges ?? []

  return (
    <>
      <Sentinel
        products={products}
        page={page}
        pageSize={itemsPerPage}
        title={title}
      />
      <ProductGrid
        shouldShowComparison={shouldShowComparison}
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
