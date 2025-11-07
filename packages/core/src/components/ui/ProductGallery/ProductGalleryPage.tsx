import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import { memo } from 'react'
import type { ProductCardProps } from 'src/components/product/ProductCard'
import { useGalleryPage } from 'src/sdk/product/usePageProductsQuery'

interface Props {
  page: number
  title: string
  productCard?: Pick<
    ProductCardProps,
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration' | 'sponsoredLabel'
  >
  itemsPerPage: number
  firstPage: number
  shouldShowComparison?: boolean
  compareLabel?: string
}

function ProductGalleryPage({
  page,
  title,
  productCard,
  itemsPerPage,
  firstPage,
  shouldShowComparison,
  compareLabel,
}: Props) {
  const { data } = useGalleryPage(page)

  const products = data?.search?.products?.edges ?? []
  const searchId = data?.search?.searchId

  function buildExtraProductProps(
    product?: Record<string, string>,
    index?: number
  ) {
    return {
      'data-af-element': 'search-result',
      'data-af-onclick': product && !!product.productId,
      'data-af-search-id': searchId,
      'data-af-product-position': index ?? Number(index) + 1, // Product position in Search Analytics starts with 1
      'data-af-product-id': product && product.productId,
    }
  }

  return (
    <Sentinel
      products={products}
      page={page}
      pageSize={itemsPerPage}
      title={title}
    >
      <ProductGrid
        shouldShowComparison={shouldShowComparison}
        compareLabel={compareLabel}
        products={products}
        page={page}
        pageSize={itemsPerPage}
        productCard={productCard}
        firstPage={firstPage}
        title={title}
        searchId={searchId}
        buildExtraProductProps={searchId && buildExtraProductProps}
      />
    </Sentinel>
  )
}

export default memo(ProductGalleryPage)
