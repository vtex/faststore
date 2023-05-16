import { useSearch } from '@faststore/sdk'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
} from '@faststore/ui'
import { NextSeo } from 'next-seo'
import type { MouseEvent } from 'react'
import { Suspense, lazy } from 'react'

import { Icon, useUI } from '@faststore/ui'
import Filter from 'src/components/search/Filter'
import Sort from 'src/components/search/Sort'
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import { mark } from 'src/sdk/tests/mark'

import { ServerCollectionPageQueryQuery } from '@generated/graphql'
import { SearchPageContextType } from 'src/pages/s'
import Section from '../Section'
import EmptyGallery from './EmptyGallery'
import styles from './section.module.scss'
import { useDelayedFacets } from './useDelayedFacets'
import { useDelayedPagination } from './useDelayedPagination'
import { useGalleryQuery } from './useGalleryQuery'
import { useProductsPrefetch } from './usePageProducts'

const GalleryPage = lazy(() => import('./ProductGalleryPage'))
const GalleryPageSkeleton = <ProductGridSkeleton loading />

type ProductGalleryContext = ServerCollectionPageQueryQuery['collection']

interface ProductGallerySectionProps {
  context?: ProductGalleryContext
  searchTermLabel?: string
  totalCountLabel?: string
  filter: {
    title?: string
    mobileOnly?: {
      filterButton?: {
        label?: string
        icon?: {
          name: string
          alt: string
        }
      }
      clearButtonLabel: string
      applyButtonLabel: string
    }
  }
  previousPageButton?: {
    label?: string
    icon?: {
      name: string
      alt: string
    }
  }
  loadMorePageButton?: {
    label?: string
    icon?: {
      name: string
      alt: string
    }
  }
}

const isSearch = (x: any): x is SearchPageContextType =>
  x === undefined || x?.title != undefined || x?.searchTerm != undefined
const isCollection = (
  x: any
): x is ServerCollectionPageQueryQuery['collection'] =>
  x?.seo != undefined && x?.seo != null && x?.sku == undefined

function ProductGallery({
  context,
  searchTermLabel,
  totalCountLabel,
  filter,
  previousPageButton,
  loadMorePageButton,
}: ProductGallerySectionProps) {
  const [title, searchTerm] = isSearch(context)
    ? [context?.title, context?.searchTerm]
    : isCollection(context)
    ? [context?.seo?.title]
    : ['']

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
        className={`${styles.section} section-product-gallery layout__content`}
      >
        <section data-testid="product-gallery" data-fs-product-listing>
          <EmptyGallery />
        </section>
      </Section>
    )
  }

  return (
    <Section
      className={`${styles.section} section-product-gallery layout__content-full`}
    >
      <section data-testid="product-gallery" data-fs-product-listing>
        {searchTerm && (
          <header
            data-fs-product-listing-search-term
            className="layout__content"
          >
            <h1>
              {searchTermLabel} <span>{searchTerm}</span>
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
              <h2 data-testid="total-product-count">
                {totalCount} {totalCountLabel}
              </h2>
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
                icon={
                  <Icon
                    name={filter?.mobileOnly?.filterButton?.icon?.name}
                    aria-label={filter?.mobileOnly?.filterButton?.icon?.alt}
                    width={16}
                    height={16}
                  />
                }
                iconPosition="left"
                onClick={openFilter}
              >
                {filter?.mobileOnly?.filterButton?.label}
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
                    <Icon
                      name={previousPageButton?.icon?.name}
                      aria-label={
                        previousPageButton?.icon?.alt ??
                        previousPageButton?.label
                      }
                      width={16}
                      height={16}
                      weight="bold"
                    />
                  }
                >
                  {previousPageButton?.label}
                </UILinkButton>
              </div>
            )}
            {/* Render ALL products */}
            {data ? (
              <Suspense fallback={GalleryPageSkeleton}>
                {pages.map((page) => (
                  <GalleryPage
                    key={`gallery-page-${page}`}
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
                  {loadMorePageButton?.label}
                </UILinkButton>
              </div>
            )}
          </div>
        </div>
      </section>
    </Section>
  )
}

ProductGallery.displayName = 'ProductGallery'
export default mark(ProductGallery)
