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
}

function ProductGalleryPage({
  page,
  title,
  productCard,
  itemsPerPage,
  firstPage,
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
