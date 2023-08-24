import { useSearch } from '@faststore/sdk'

import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import { ProductCardProps } from 'src/components/product/ProductCard'
import { memo } from 'react'
import { usePageProductsQuery } from 'src/sdk/product/usePageProductsQuery'
import {
  ProductListingPageContext,
  SearchPageContext,
  usePage,
} from 'src/sdk/overrides/PageProvider'

interface Props {
  page: number
  title: string
  productCard?: Pick<ProductCardProps, 'showDiscountBadge' | 'bordered'>
  itemsPerPage: number
}

function ProductGalleryPage({ page, title, productCard, itemsPerPage }: Props) {
  const {
    state: { term, sort, selectedFacets },
  } = useSearch()

  const context = usePage() as ProductListingPageContext | SearchPageContext
  const productsPerPage = context?.data?.productsPerPage

  const { currentProductsPerPage } = usePageProductsQuery(
    {
      page,
      term,
      sort,
      selectedFacets,
      itemsPerPage,
    },
    productsPerPage
  )

  const products = currentProductsPerPage?.data?.search?.products?.edges ?? []

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
