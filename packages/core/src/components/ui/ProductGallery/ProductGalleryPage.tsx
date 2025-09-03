import ProductGrid from '../../product/ProductGrid'
import Sentinel from '../../../sdk/search/Sentinel'

import { memo } from 'react'
import type { ProductCardProps } from '../../product/ProductCard'
import { useGalleryPage } from '../../../sdk/product/usePageProductsQuery'

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
      />
    </Sentinel>
  )
}

export default memo(ProductGalleryPage)
