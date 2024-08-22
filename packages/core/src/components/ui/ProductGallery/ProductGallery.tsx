import { useSearch } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import type { MouseEvent } from 'react'

import { useUI } from '@faststore/ui'
import Sort from 'src/components/search/Sort'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import dynamic from 'next/dynamic'
import { ProductCardProps } from 'src/components/product/ProductCard'
import { FilterSliderProps } from 'src/components/search/Filter/FilterSlider'
import { SortProps } from 'src/components/search/Sort/Sort'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import {
  PLPContext,
  SearchPageContext,
  usePage,
} from 'src/sdk/overrides/PageProvider'
import { useProductsPrefetch } from 'src/sdk/product/useProductsPrefetch'
import { useDelayedFacets } from 'src/sdk/search/useDelayedFacets'
import { useDelayedPagination } from 'src/sdk/search/useDelayedPagination'
import { useFilter } from 'src/sdk/search/useFilter'
import useDeviceDetect from 'src/sdk/ui/useDeviceDetect'
import ProductGalleryPage from './ProductGalleryPage'

const FilterSkeleton = dynamic(
  () =>
    import(
      /* webpackChunkName: "FilterSkeleton" */
      'src/components/skeletons/FilterSkeleton'
    )
)

const GalleryPageSkeleton = <ProductGridSkeleton loading />

export interface ProductGalleryProps {
  title?: string
  searchTerm?: string
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
  productCard?: Pick<
    ProductCardProps,
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration'
  >
}

function ProductGallery({
  title,
  searchTerm,
  totalCount,
  searchTermLabel,
  totalCountLabel,
  filter: filterCmsData,
  previousPageButton,
  loadMorePageButton,
  sortBySelector,
  productCard,
}: ProductGalleryProps) {
  const {
    FilterButtonSkeleton,
    FilterIcon,
    LinkButtonNext,
    LinkButtonPrev,
    MobileFilterButton,
    PrevIcon,
    ResultsCountSkeleton,
    SortSkeleton,
    __experimentalFilterDesktop: FilterDesktop,
    __experimentalFilterSlider: FilterSlider,
  } = useOverrideComponents<'ProductGallery'>()

  const { openFilter, filter: displayFilter } = useUI()
  const { pages, addNextPage, addPrevPage, itemsPerPage } = useSearch()
  const context = usePage<SearchPageContext | PLPContext>()
  const data = context?.data
  const facets = useDelayedFacets(data) ?? []
  const { next, prev } = useDelayedPagination(totalCount)
  const isMobile = useDeviceDetect()

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  const hasFacetsLoaded = Boolean(data?.search?.facets)
  const hasProductsLoaded = Boolean(data?.search?.products)
  const filter = useFilter(facets)

  return (
    <section data-testid="product-gallery" data-fs-product-listing>
      {searchTerm && (
        <header
          data-fs-product-listing-search-term
          data-fs-content="product-gallery"
        >
          <h1>
            {searchTermLabel} <span>{searchTerm}</span>
          </h1>
        </header>
      )}
      <div
        data-fs-product-listing-content-grid
        data-fs-content="product-gallery"
      >
        {!isMobile && (
          <div data-fs-product-listing-filters>
            <FilterSkeleton loading={!hasFacetsLoaded}>
              {hasFacetsLoaded && facets?.length > 0 && (
                <div className="hidden-mobile">
                  <FilterDesktop.Component
                    {...FilterDesktop.props}
                    {...filter}
                    title={filterCmsData?.title}
                  />
                </div>
              )}
            </FilterSkeleton>
          </div>
        )}
        {isMobile && displayFilter && (
          <div data-fs-product-listing-filters>
            <FilterSlider.Component
              {...FilterSlider.props}
              {...filter}
              title={filterCmsData?.title}
              clearButtonLabel={filterCmsData?.mobileOnly?.clearButtonLabel}
              applyButtonLabel={filterCmsData?.mobileOnly?.applyButtonLabel}
            />
          </div>
        )}

        <div data-fs-product-listing-results-count data-count={totalCount}>
          <ResultsCountSkeleton.Component
            data-fs-product-listing-results-count-skeleton
            size={{ width: '100%', height: '1.5rem' }}
            {...ResultsCountSkeleton.props}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={!hasProductsLoaded}
          >
            <h2 data-testid="total-product-count">
              {totalCount} {totalCountLabel}
            </h2>
          </ResultsCountSkeleton.Component>
        </div>
        <div data-fs-product-listing-sort>
          <SortSkeleton.Component
            data-fs-product-listing-sort-skeleton
            size={{ width: 'auto', height: '1.5rem' }}
            {...SortSkeleton.props}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={!hasProductsLoaded}
          >
            <Sort
              label={sortBySelector?.label}
              options={sortBySelector?.options}
            />
          </SortSkeleton.Component>
          <FilterButtonSkeleton.Component
            data-fs-product-listing-filter-button-skeleton
            size={{ width: '6rem', height: '1.5rem' }}
            {...FilterButtonSkeleton.props}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            loading={!hasFacetsLoaded}
          >
            {hasFacetsLoaded && facets?.length > 0 && (
              <MobileFilterButton.Component
                variant="tertiary"
                data-testid="open-filter-button"
                icon={
                  <FilterIcon.Component
                    width={16}
                    height={16}
                    {...FilterIcon.props}
                    name={
                      filterCmsData?.mobileOnly?.filterButton?.icon?.icon ??
                      FilterIcon.props.name
                    }
                    aria-label={
                      filterCmsData?.mobileOnly?.filterButton?.icon?.alt ??
                      FilterIcon.props['aria-label']
                    }
                  />
                }
                iconPosition="left"
                {...MobileFilterButton.props}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={openFilter}
              >
                {filterCmsData?.mobileOnly?.filterButton?.label}
              </MobileFilterButton.Component>
            )}
          </FilterButtonSkeleton.Component>
        </div>
        <div data-fs-product-listing-results>
          {/* Add link to previous page. This helps on SEO */}
          {prev !== false && (
            <div data-fs-product-listing-pagination="top">
              <NextSeo
                additionalLinkTags={[{ rel: 'prev', href: prev.link }]}
              />
              <LinkButtonPrev.Component
                rel="prev"
                variant="secondary"
                iconPosition="left"
                icon={
                  <PrevIcon.Component
                    width={16}
                    height={16}
                    weight="bold"
                    {...PrevIcon.props}
                    name={previousPageButton?.icon?.icon ?? PrevIcon.props.name}
                    aria-label={
                      previousPageButton?.icon?.alt ??
                      previousPageButton?.label ??
                      PrevIcon.props['aria-label']
                    }
                  />
                }
                {...LinkButtonPrev.props}
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
              </LinkButtonPrev.Component>
            </div>
          )}
          {/* Render ALL products */}
          {hasProductsLoaded ? (
            <>
              {pages.map((page) => (
                <ProductGalleryPage
                  key={`gallery-page-${page}`}
                  page={page}
                  title={title}
                  productCard={productCard}
                  itemsPerPage={itemsPerPage}
                  products={data?.search?.products?.edges}
                />
              ))}
            </>
          ) : (
            GalleryPageSkeleton
          )}
          {/* Add link to next page. This helps on SEO */}
          {next !== false && (
            <div data-fs-product-listing-pagination="bottom">
              <NextSeo
                additionalLinkTags={[{ rel: 'next', href: next.link }]}
              />
              <LinkButtonNext.Component
                testId="show-more"
                rel="next"
                variant="secondary"
                {...LinkButtonNext.props}
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
              </LinkButtonNext.Component>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductGallery
