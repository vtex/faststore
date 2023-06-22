import { mark } from 'src/sdk/tests/mark'

import { ServerCollectionPageQueryQuery } from '@generated/graphql'
import ProductGallery, {
  ProductGalleryProps,
} from 'src/components/ui/ProductGallery/ProductGallery'
import { SearchPageContextType } from 'src/pages/s'
import Section from '../Section'
import EmptyGallery from './EmptyGallery'
import styles from './section.module.scss'
import { useGalleryQuery } from './useGalleryQuery'

type ProductGalleryContext = ServerCollectionPageQueryQuery['collection']

export interface ProductGallerySectionProps {
  context?: ProductGalleryContext
  searchTermLabel?: ProductGalleryProps['searchTermLabel']
  totalCountLabel?: ProductGalleryProps['totalCountLabel']
  filter: ProductGalleryProps['filter']
  previousPageButton?: ProductGalleryProps['previousPageButton']
  itemsPerPage?: ProductGalleryProps['itemsPerPage']
  loadMorePageButton?: ProductGalleryProps['loadMorePageButton']
  sortBySelector?: ProductGalleryProps['sortBySelector']
  productCard?: ProductGalleryProps['productCard']
}

const isSearch = (x: any): x is SearchPageContextType =>
  x === undefined || x?.title != undefined || x?.searchTerm != undefined
const isCollection = (
  x: any
): x is ServerCollectionPageQueryQuery['collection'] =>
  x?.seo != undefined && x?.seo != null && x?.sku == undefined

function ProductGallerySection({
  context,
  ...otherProps
}: ProductGallerySectionProps) {
  const [title, searchTerm] = isSearch(context)
    ? [context?.title, context?.searchTerm]
    : isCollection(context)
    ? [context?.seo?.title]
    : ['']

  const { data: productGalleryData } = useGalleryQuery()
  const totalCount =
    productGalleryData?.search.products.pageInfo.totalCount ?? 0

  if (productGalleryData && totalCount === 0) {
    return (
      <Section className={`${styles.section} section-product-gallery`}>
        <section data-testid="product-gallery" data-fs-product-listing>
          <EmptyGallery />
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
        productGalleryData={productGalleryData}
        totalCount={totalCount}
        {...otherProps}
      />
    </Section>
  )
}

ProductGallerySection.displayName = 'ProductGallery'
export default mark(ProductGallerySection)
