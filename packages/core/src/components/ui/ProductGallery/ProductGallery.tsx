import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState, type MouseEvent } from 'react'

import { useSearch } from '@faststore/sdk'
import { useUI } from '@faststore/ui'

import type { ProductCardProps } from 'src/components/product/ProductCard'
import type { FilterSliderProps } from 'src/components/search/Filter/FilterSlider'
import Sort from 'src/components/search/Sort'
import type { SortProps } from 'src/components/search/Sort/Sort'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import {
  usePage,
  type PLPContext,
  type SearchPageContext,
} from 'src/sdk/overrides/PageProvider'
import { useProductsPrefetch } from 'src/sdk/product/useProductsPrefetch'
import { useDelayedFacets } from 'src/sdk/search/useDelayedFacets'
import { useDelayedPagination } from 'src/sdk/search/useDelayedPagination'
import { useFilter } from 'src/sdk/search/useFilter'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import styles from '../../sections/ProductGallery/section.module.scss'
import GalleryPageHeightLock, {
  getGalleryViewportBucket,
  resolveReservedGalleryHeight,
} from './GalleryPageHeightLock'
import ProductGalleryPage from './ProductGalleryPage'
const FilterSkeleton = dynamic(
  () =>
    import(
      /* webpackChunkName: "FilterSkeleton" */
      'src/components/skeletons/FilterSkeleton'
    )
)

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
  productComparison?: {
    enabled?: boolean
    labels?: {
      compareButton: string
      clearSelectionButton: string
      selectionWarning: string
      sidebarComponent?: {
        title: string
        sortLabels?: {
          label?: string
          options?: {
            productByName?: string
            productByPrice?: string
          }
        }
        filterLabel: string
        preferencesLabel: string
        toggleFieldLabel: string
        cartButtonLabel: string
        priceWithTaxLabel: string
      }
      technicalInformation?: {
        title: string
        description: string
      }
    }
  }
  itemsPerPage?: number
  loadMorePageButton?: {
    label?: string
  }
  sortBySelector?: SortProps
  productCard?: Pick<
    ProductCardProps,
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration' | 'sponsoredLabel'
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
  productComparison,
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
    ToggleField,
    ProductComparison,
    ProductComparisonToolbar,
    __experimentalFilterDesktop: FilterDesktop,
    __experimentalFilterSlider: FilterSlider,
    __experimentalProductComparisonSidebar: ProductComparisonSidebar,
  } = useOverrideComponents<'ProductGallery'>()

  const { openFilter, filter: displayFilter } = useUI()
  const {
    pages,
    addNextPage,
    addPrevPage,
    itemsPerPage,
    state: { term, sort, selectedFacets },
  } = useSearch()
  const context = usePage<SearchPageContext | PLPContext>()
  const data = context?.data
  const facets = useDelayedFacets(data) ?? []
  const { next, prev } = useDelayedPagination(totalCount ?? 0)

  const [showComparisonProducts, setShowComparisonProducts] =
    useState<boolean>(false)

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  const { isDesktop } = useScreenResize()

  const hasFacetsLoaded = Boolean(data?.search?.facets)
  const hasProductsLoaded = Boolean(data?.search?.products)
  const initialSelectedFacets =
    (data as PLPContext['data'])?.collection?.meta?.selectedFacets ?? []
  const filter = useFilter(facets, initialSelectedFacets)

  // Keep the results column tall on PDP→PLP back nav before pages remount.
  // Only while products are loading — once grids paint, natural height wins
  // (avoids huge gaps after a viewport resize with a stale reserved minHeight).
  // Populate after mount so SSR/hydration always start at 0 (sessionStorage is
  // client-only and would otherwise mismatch).
  const [reservedGalleryHeight, setReservedGalleryHeight] = useState(0)

  useEffect(() => {
    setReservedGalleryHeight(
      resolveReservedGalleryHeight(hasProductsLoaded, pages, {
        path: globalThis.location.pathname,
        term: term ?? null,
        sort: sort ?? null,
        selectedFacets,
        viewport: getGalleryViewportBucket(),
      })
    )
  }, [pages, term, sort, selectedFacets, hasProductsLoaded])

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
      <ProductComparison.Component>
        <div
          data-fs-product-listing-content-grid
          data-fs-content="product-gallery"
        >
          {isDesktop && (
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
          {!isDesktop && displayFilter && (
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
            {productComparison?.enabled && (
              <ToggleField.Component
                id="toggle-field-comparison"
                label={productComparison?.labels?.compareButton ?? ''}
                checked={showComparisonProducts}
                onChange={() =>
                  setShowComparisonProducts(!showComparisonProducts)
                }
                {...ToggleField.props}
              />
            )}
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
                        FilterIcon.props.name ??
                        ''
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
          <div
            data-fs-product-listing-results
            style={
              reservedGalleryHeight > 0
                ? { minHeight: reservedGalleryHeight }
                : undefined
            }
          >
            {/* Add link to previous page. This helps on SEO */}
            {!!prev && (
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
                      name={
                        previousPageButton?.icon?.icon ??
                        PrevIcon.props.name ??
                        ''
                      }
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
            {/* Render ALL products.
                Each page has its own Suspense boundary so a refetch on page N
                does not unmount pages that already have data (avoids CLS when
                returning from a PDP with infinite-scroll pages restored).
                GalleryPageHeightLock keeps the last measured page height while
                skeletons are shown so the list does not collapse — including
                the initial !hasProductsLoaded frame. */}
            {pages.map((page) => (
              <GalleryPageHeightLock key={`gallery-page-${page}`} page={page}>
                {hasProductsLoaded ? (
                  <Suspense
                    fallback={
                      <ProductGridSkeleton loading count={itemsPerPage} />
                    }
                  >
                    <ProductGalleryPage
                      page={page}
                      title={title ?? ''}
                      productCard={productCard}
                      itemsPerPage={itemsPerPage}
                      firstPage={pages[0]}
                      shouldShowComparison={showComparisonProducts}
                      compareLabel={productComparison?.labels?.compareButton}
                    />
                  </Suspense>
                ) : (
                  <ProductGridSkeleton loading count={itemsPerPage} />
                )}
              </GalleryPageHeightLock>
            ))}
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
        {showComparisonProducts && (
          <>
            <ProductComparisonSidebar.Component
              direction="rightSide"
              size="partial"
              priceFormatter={useFormattedPrice}
              technicalInformation={{
                title: productComparison?.labels?.technicalInformation?.title,
                description:
                  productComparison?.labels?.technicalInformation?.description,
              }}
              overlayProps={{ className: styles.section }}
              {...productComparison?.labels?.sidebarComponent}
            />
            <ProductComparisonToolbar.Component
              selectionWarningLabel={
                productComparison?.labels?.selectionWarning
              }
              clearSelectionButtonLabel={
                productComparison?.labels?.clearSelectionButton
              }
              compareButtonLabel={productComparison?.labels?.compareButton}
            />
          </>
        )}
      </ProductComparison.Component>
    </section>
  )
}

export default ProductGallery
