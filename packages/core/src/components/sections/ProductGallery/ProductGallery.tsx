'use client'

import { mark } from '../../../sdk/tests/mark'

import Section from '../../../../app/components/sections/Section'
import ProductGallery, {
  ProductGalleryProps,
} from '../../ui/ProductGallery/ProductGallery'
import type { EmptyGalleryProps } from './EmptyGallery'

import { getOverridableSection } from '../../../../app/sdk/overrides/getOverriddenSection'
import { useOverrideComponents } from '../../../../app/sdk/overrides/OverrideContext'
import {
  PLPContext,
  SearchPageContext,
  isPLP,
  isSearchPage,
  usePage,
} from '../../../../app/sdk/overrides/PageProvider'
import { ProductGalleryDefaultComponents } from './DefaultComponents'
import styles from './section.module.scss'

export interface ProductGallerySectionProps {
  searchTermLabel?: ProductGalleryProps['searchTermLabel']
  totalCountLabel?: ProductGalleryProps['totalCountLabel']
  filter: ProductGalleryProps['filter']
  previousPageButton?: ProductGalleryProps['previousPageButton']
  itemsPerPage?: ProductGalleryProps['itemsPerPage']
  loadMorePageButton?: ProductGalleryProps['loadMorePageButton']
  sortBySelector?: ProductGalleryProps['sortBySelector']
  productCard?: ProductGalleryProps['productCard']
  emptyGallery?: EmptyGalleryProps
}

function ProductGallerySection({
  emptyGallery,
  ...otherProps
}: ProductGallerySectionProps) {
  const { __experimentalEmptyGallery: EmptyGallery } =
    useOverrideComponents<'ProductGallery'>()

  const context = usePage<SearchPageContext | PLPContext>()
  const [title, searchTerm] = isSearchPage(context)
    ? [context?.data?.title, context?.data?.searchTerm]
    : isPLP(context)
    ? [context?.data?.collection?.seo?.title]
    : ['']

  const totalCount = context?.data?.search?.products?.pageInfo?.totalCount ?? 0

  if (context?.data?.search?.products && totalCount === 0) {
    return (
      <Section className={`${styles.section} section-product-gallery`}>
        <section data-testid="product-gallery" data-fs-product-listing>
          <EmptyGallery.Component {...emptyGallery} />
        </section>
      </Section>
    )
  }

  return (
    <Section
      className={`${styles.section} section-product-gallery layout__section`}
    >
      <ProductGallery
        title={title}
        searchTerm={searchTerm}
        totalCount={totalCount}
        {...otherProps}
      />
    </Section>
  )
}

ProductGallerySection.displayName = 'ProductGallery'
const MarkedProductGallery = mark(ProductGallerySection)

const OverridableProductGallery = getOverridableSection<
  typeof MarkedProductGallery
>('ProductGallery', MarkedProductGallery, ProductGalleryDefaultComponents)

export default OverridableProductGallery
