import ProductGallery, {
  type ProductGalleryProps,
} from '../../ui/ProductGallery/ProductGallery'
import Section from '../Section'
import type { EmptyGalleryProps } from './EmptyGallery'

import styles from './section.module.scss'

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

function AddToCartBtn() {
  return (
    <button
      type="button"
      style={{
        background: '#00419e',
        color: 'white',
        padding: '4px 6px',
        borderRadius: '12px',
        fontSize: '10px',
        margin: '4px 0',
        cursor: 'pointer',
      }}
    >
      Add to cart
    </button>
  )
}

function ProductCard({ item }: { item: any }) {
  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: '16px',
        borderRadius: '8px',
        width: '300px',
        height: '400px',
        float: 'left',
        margin: '0 10px 20px 10px',
      }}
    >
      <img src={item.image} alt={item.name} width={250} />
      <p key={item.id} style={{ fontSize: '12px' }}>
        {item.name}
      </p>
      <p>R$ {item.price}</p>
      <AddToCartBtn />
    </div>
  )
}

function ProductGallerySection() {
  const storage = JSON.parse(localStorage.getItem('searchTerm'))

  return (
    <Section
      className={`${styles.section} section-product-gallery layout__section`}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button
          type="button"
          style={{
            background: '#00419e',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
          }}
        >
          Add all to cart
        </button>
      </div>
      <div style={{ padding: '0 0 0 10%' }}>
        {storage.products.map((item: any) => (
          <ProductCard key={item.id} item={item} />
        ))}
        <div style={{ content: '', display: 'table', clear: 'both' }} />
      </div>
    </Section>
  )
}

ProductGallerySection.$componentKey = 'ProductGallery'

const OverridableProductGallery = getOverridableSection<
  typeof ProductGallerySection
>('ProductGallery', ProductGallerySection, ProductGalleryDefaultComponents)

export default OverridableProductGallery
