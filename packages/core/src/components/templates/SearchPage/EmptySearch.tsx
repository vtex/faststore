import EmptyState from 'src/components/sections/EmptyState'
import ProductGalleryStyles from 'src/components/sections/ProductGallery/section.module.scss'
import Section from 'src/components/sections/Section'

export type EmptySearchProps = {
  title?: string
  term?: string
}

export default function EmptySearch({ title, term }: EmptySearchProps) {
  return (
    <Section
      className={`${ProductGalleryStyles.section} section-product-gallery`}
    >
      <section
        data-testid="product-gallery"
        data-fs-product-listing
        data-fs-search-loading
      >
        {title && (
          <h1 data-fs-empty-search-title>
            {title} <strong>{term}</strong>
          </h1>
        )}
        <EmptyState title="" showLoader />
      </section>
    </Section>
  )
}
