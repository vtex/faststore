import { useSearch } from '@faststore/sdk'

import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import { ProductCardProps } from 'src/components/product/ProductCard'
import { useProducts } from './usePageProducts'

interface Props {
  page: number
  title: string
  productCard?: Pick<ProductCardProps, 'showDiscountBadge' | 'bordered'>
}

function GalleryPage({ page, title, productCard }: Props) {
  const products = useProducts(page) ?? []
  const { itemsPerPage } = useSearch()

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

export default GalleryPage
