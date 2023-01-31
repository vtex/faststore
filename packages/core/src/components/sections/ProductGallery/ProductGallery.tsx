import { useSearch } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { lazy, Suspense } from 'react'
import type { MouseEvent } from 'react'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
} from '@faststore/ui'

import Filter from 'src/components/search/Filter'
import Sort from 'src/components/search/Sort'
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import Icon from 'src/components/ui/Icon'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from '@faststore/ui'

import Section from '../Section'
import EmptyGallery from './EmptyGallery'
import styles from './product-gallery.module.scss'
import { useDelayedFacets } from './useDelayedFacets'
import { useDelayedPagination } from './useDelayedPagination'
import { useGalleryQuery } from './useGalleryQuery'
import { useProductsPrefetch } from './usePageProducts'

const GalleryPage = lazy(() => import('./ProductGalleryPage'))
const GalleryPageSkeleton = <ProductGridSkeleton loading />

interface Props {
  title: string
  searchTerm?: string
}

function ProductGallery({ title, searchTerm }: Props) {
  const { openFilter } = useUI()
  const { pages, addNextPage, addPrevPage } = useSearch()

  const { data } = useGalleryQuery()
  const facets = useDelayedFacets(data)
  const totalCount = data?.search.products.pageInfo.totalCount ?? 0
  const { next, prev } = useDelayedPagination(totalCount)

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  if (data && totalCount === 0) {
    return (
      <Section
        data-testid="product-gallery"
        className={`${styles.fsProductListing} layout__content`}
        data-fs-product-listing
      >
        <EmptyGallery />
      </Section>
    )
  }

  return (
    <Section
      data-testid="product-gallery"
      className={`${styles.fsProductListing} layout__content-full`}
      data-fs-product-listing
    >
      {searchTerm && (
        <header data-fs-product-listing-search-term className="layout__content">
          <h1>
            Showing results for: <span>{searchTerm}</span>
          </h1>
        </header>
      )}
      <div data-fs-product-listing-content-grid className="layout__content">
        <div data-fs-product-listing-filters>
          <FilterSkeleton loading={facets?.length === 0}>
            <Filter facets={facets} />
          </FilterSkeleton>
        </div>

        <div data-fs-product-listing-results-count data-count={totalCount}>
          <UISkeleton
            data-fs-product-listing-results-count-skeleton
            loading={!data}
            size={{ width: '100%', height: '1.5rem' }}
          >
            <h2 data-testid="total-product-count">{totalCount} Results</h2>
          </UISkeleton>
        </div>

        <div data-fs-product-listing-sort>
          <UISkeleton
            data-fs-product-listing-sort-skeleton
            loading={facets?.length === 0}
            size={{ width: 'auto', height: '1.5rem' }}
          >
            <Sort />
          </UISkeleton>

          <UISkeleton
            data-fs-product-listing-filter-button-skeleton
            loading={facets?.length === 0}
            size={{ width: '6rem', height: '1.5rem' }}
          >
            <UIButton
              variant="tertiary"
              data-testid="open-filter-button"
              icon={<Icon name="FadersHorizontal" width={16} height={16} />}
              iconPosition="left"
              aria-label="Open Filters"
              onClick={openFilter}
            >
              Filters
            </UIButton>
          </UISkeleton>
        </div>

        <div data-fs-product-listing-results>
          {/* Add link to previous page. This helps on SEO */}
          {prev !== false && (
            <div data-fs-product-listing-pagination="top">
              <NextSeo
                additionalLinkTags={[{ rel: 'prev', href: prev.link }]}
              />
              <UILinkButton
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addPrevPage()
                }}
                href={prev.link}
                rel="prev"
                variant="secondary"
                iconPosition="left"
                icon={
                  <Icon name="ArrowLeft" width={16} height={16} weight="bold" />
                }
              >
                Previous Page
              </UILinkButton>
            </div>
          )}

          {/* Render ALL products */}
          {data ? (
            <Suspense fallback={GalleryPageSkeleton}>
              {pages.map((page) => (
                <GalleryPage
                  key={`gallery-page-${page}`}
                  showSponsoredProducts={false}
                  page={page}
                  title={title}
                />
              ))}
            </Suspense>
          ) : (
            GalleryPageSkeleton
          )}

          {/* Add link to next page. This helps on SEO */}
          {next !== false && (
            <div data-fs-product-listing-pagination="bottom">
              <NextSeo
                additionalLinkTags={[{ rel: 'next', href: next.link }]}
              />
              <UILinkButton
                testId="show-more"
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addNextPage()
                }}
                href={next.link}
                rel="next"
                variant="secondary"
              >
                Load more products
              </UILinkButton>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

ProductGallery.displayName = 'ProductGallery'
export default mark(ProductGallery)
