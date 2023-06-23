import { useSearch } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import type { MouseEvent } from 'react'
import { Suspense, lazy } from 'react'

import { useUI } from '@faststore/ui'
import Filter from 'src/components/search/Filter'
import Sort from 'src/components/search/Sort'
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import { ProductGalleryQueryQuery } from '@generated/graphql'
import { ProductCardProps } from 'src/components/product/ProductCard'
import { FilterSliderProps } from 'src/components/search/Filter/FilterSlider'
import { SortProps } from 'src/components/search/Sort/Sort'
import { useDelayedFacets } from './useDelayedFacets'
import { useDelayedPagination } from './useDelayedPagination'
import { useProductsPrefetch } from './usePageProducts'
import {
  Components,
  Props,
} from 'src/components/sections/ProductGallery/Overrides'

const GalleryPage = lazy(() => import('./ProductGalleryPage'))
const GalleryPageSkeleton = <ProductGridSkeleton loading />

const {
  Button,
  FilterIcon,
  PrevIcon,
  ResultsCountSkeleton,
  SortSkeleton,
  FilterButtonSkeleton,
  LinkButtonPrev,
  LinkButtonNext,
} = Components

export interface ProductGalleryProps {
  title?: string
  searchTerm?: string
  productGalleryData?: ProductGalleryQueryQuery
  totalCount?: number
  searchTermLabel?: string
  totalCountLabel?: string
  filter: {
    title?: string
    mobileOnly?: {
      filterButton?: {
        label?: string
        icon?: {
          icon: string
          alt: string
        }
      }
      clearButtonLabel: FilterSliderProps['clearButtonLabel']
      applyButtonLabel: FilterSliderProps['applyButtonLabel']
    }
  }
  previousPageButton?: {
    label?: string
    icon?: {
      icon: string
      alt: string
    }
  }
  itemsPerPage?: number
  loadMorePageButton?: {
    label?: string
  }
  sortBySelector?: SortProps
  productCard?: Pick<ProductCardProps, 'showDiscountBadge' | 'bordered'>
}

function ProductGallery({
  title,
  searchTerm,
  productGalleryData,
  totalCount,
  searchTermLabel,
  totalCountLabel,
  filter,
  previousPageButton,
  loadMorePageButton,
  sortBySelector,
  productCard,
}: ProductGalleryProps) {
  const { openFilter } = useUI()
  const { pages, addNextPage, addPrevPage } = useSearch()
  const facets = useDelayedFacets(productGalleryData)
  const { next, prev } = useDelayedPagination(totalCount)

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  return (
    <section data-testid="product-gallery" data-fs-product-listing>
      {searchTerm && (
        <header data-fs-product-listing-search-term>
          <h1>
            {searchTermLabel} <span>{searchTerm}</span>
          </h1>
        </header>
      )}
      <div
        data-fs-product-listing-content-grid
        data-fs-content="product-gallery"
      >
        <div data-fs-product-listing-filters>
          <FilterSkeleton loading={facets?.length === 0}>
            <Filter facets={facets} filter={filter} />
          </FilterSkeleton>
        </div>
        <div data-fs-product-listing-results-count data-count={totalCount}>
          <ResultsCountSkeleton
            data-fs-product-listing-results-count-skeleton
            size={{ width: '100%', height: '1.5rem' }}
            {...Props['ResultsCountSkeleton']}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={!productGalleryData}
          >
            <h2 data-testid="total-product-count">
              {totalCount} {totalCountLabel}
            </h2>
          </ResultsCountSkeleton>
        </div>
        <div data-fs-product-listing-sort>
          <SortSkeleton
            data-fs-product-listing-sort-skeleton
            size={{ width: 'auto', height: '1.5rem' }}
            {...Props['SortSkeleton']}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={facets?.length === 0}
          >
            <Sort
              label={sortBySelector?.label}
              options={sortBySelector?.options}
            />
          </SortSkeleton>
          <FilterButtonSkeleton
            data-fs-product-listing-filter-button-skeleton
            size={{ width: '6rem', height: '1.5rem' }}
            {...Props['FilterButtonSkeleton']}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={facets?.length === 0}
          >
            <Button
              variant="tertiary"
              data-testid="open-filter-button"
              icon={
                <FilterIcon
                  width={16}
                  height={16}
                  {...Props['FilterIcon']}
                  name={
                    filter?.mobileOnly?.filterButton?.icon?.icon ??
                    Props['FilterIcon'].name
                  }
                  aria-label={
                    filter?.mobileOnly?.filterButton?.icon?.alt ??
                    Props['FilterIcon']['aria-label']
                  }
                />
              }
              iconPosition="left"
              {...Props['Button']}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              onClick={openFilter}
            >
              {filter?.mobileOnly?.filterButton?.label}
            </Button>
          </FilterButtonSkeleton>
        </div>
        <div data-fs-product-listing-results>
          {/* Add link to previous page. This helps on SEO */}
          {prev !== false && (
            <div data-fs-product-listing-pagination="top">
              <NextSeo
                additionalLinkTags={[{ rel: 'prev', href: prev.link }]}
              />
              <LinkButtonPrev
                rel="prev"
                variant="secondary"
                iconPosition="left"
                icon={
                  <PrevIcon
                    width={16}
                    height={16}
                    weight="bold"
                    {...Props['PrevIcon']}
                    name={
                      previousPageButton?.icon?.icon ?? Props['PrevIcon'].name
                    }
                    aria-label={
                      previousPageButton?.icon?.alt ??
                      previousPageButton?.label ??
                      Props['PrevIcon']['aria-label']
                    }
                  />
                }
                {...Props['LinkButtonPrev']}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addPrevPage()
                }}
                href={prev.link}
              >
                {previousPageButton?.label}
              </LinkButtonPrev>
            </div>
          )}
          {/* Render ALL products */}
          {productGalleryData ? (
            <Suspense fallback={GalleryPageSkeleton}>
              {pages.map((page) => (
                <GalleryPage
                  key={`gallery-page-${page}`}
                  page={page}
                  title={title}
                  productCard={productCard}
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
              <LinkButtonNext
                testId="show-more"
                rel="next"
                variant="secondary"
                {...Props['LinkButtonNext']}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addNextPage()
                }}
                href={next.link}
              >
                {loadMorePageButton?.label}
              </LinkButtonNext>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductGallery
