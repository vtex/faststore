import { mark } from 'src/sdk/tests/mark'

import ProductGallery, {
  ProductGalleryProps,
} from 'src/components/ui/ProductGallery/ProductGallery'
import Section from '../Section'
import type { EmptyGalleryProps } from './EmptyGallery'

import { __experimentalEmptyGallery as EmptyGallery } from 'src/components/sections/ProductGallery/Overrides'

import styles from './section.module.scss'
import {
  PLPContext,
  SearchPageContext,
  isPLP,
  isSearchPage,
  usePage,
} from 'src/sdk/overrides/PageProvider'

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
export default mark(ProductGallerySection)
