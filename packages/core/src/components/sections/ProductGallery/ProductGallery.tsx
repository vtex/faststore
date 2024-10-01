import ProductGallery, {
  ProductGalleryProps,
} from '../../ui/ProductGallery/ProductGallery'
import Section from '../Section'
import type { EmptyGalleryProps } from './EmptyGallery'

import styles from './section.module.scss'
import {
  PLPContext,
  SearchPageContext,
  isPLP,
  isSearchPage,
  usePage,
} from '../../../sdk/overrides/PageProvider'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { ProductGalleryDefaultComponents } from './DefaultComponents'

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

const OverridableProductGallery = getOverridableSection<
  typeof ProductGallerySection
>('ProductGallery', ProductGallerySection, ProductGalleryDefaultComponents)

export default OverridableProductGallery
