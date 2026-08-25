import { type ComponentType, useId, useMemo } from 'react'

import { Carousel, ProductShelf } from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import DefaultProductCard, {
  type ProductCardProps,
} from 'src/components/product/ProductCard'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useRecommendationShelf } from 'src/sdk/recommendations'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import type {
  RecommendationProductCardMapper,
  RecommendationShelfProps,
} from './RecommendationShelf.types'
import styles from './section.module.scss'

const DEFAULT_SECTION_CLASS_NAME = `${styles.section} section-product-shelf layout__section section`

export function RecommendationShelf<
  TCardProps extends object = ProductCardProps,
>({
  title,
  campaignVrn,
  enableRecommendations = false,
  itemsContext = 'PDP',
  freezeContext = false,
  className,
  afElement = 'recommendation-shelf',
  ProductCard,
  mapProductToProductCard,
  carouselConfiguration,
  productCardConfiguration,
}: RecommendationShelfProps<TCardProps>) {
  const {
    itemsPerPageDesktop = 4,
    itemsPerPageMobile = 2,
    variant = 'scroll',
    infiniteMode = false,
    controls,
  } = carouselConfiguration ?? {}

  const CardComponent = (ProductCard ??
    DefaultProductCard) as ComponentType<TCardProps>

  const mapToCardProps = (mapProductToProductCard ??
    ((product: ProductSummary_ProductFragment, index: number) => ({
      product,
      index,
      ...productCardConfiguration,
    }))) as RecommendationProductCardMapper<TCardProps>

  const id = useId()
  const { isMobile, isTablet } = useScreenResize()
  // Treat mobile and tablet viewports (<= 768px) as "mobile" for paging, which
  // matches the carousel layout the shelf was designed around.
  const itemsPerPage =
    isMobile || isTablet ? itemsPerPageMobile : itemsPerPageDesktop

  const { items, isLoading, error, campaign, correlationId } =
    useRecommendationShelf({
      campaignVrn,
      enableRecommendations,
      itemsContext,
      freezeContext,
    })

  const campaignId = campaign?.id

  const productIds = useMemo(
    () => items.map((p) => p.isVariantOf.productGroupID).join(', '),
    [items]
  )

  const shouldAddAFAttr = !!(
    !isLoading &&
    correlationId &&
    campaignId &&
    productIds.length
  )

  if (error) {
    return null
  }

  if (!isLoading && items.length === 0) {
    return null
  }

  return (
    <section
      className={className ?? DEFAULT_SECTION_CLASS_NAME}
      {...(shouldAddAFAttr
        ? {
            'data-af-element': afElement,
            'data-af-onimpression': true,
            'data-af-onview': true,
            'data-af-correlation-id': correlationId,
            'data-af-campaign-id': campaignId,
            'data-af-products': productIds,
          }
        : {})}
    >
      <ProductShelfSkeleton
        loading={isLoading}
        itemsPerPage={Math.ceil(itemsPerPage)}
      >
        {(title || campaign?.title) && (
          <h2
            className="text__title-section layout__content"
            data-fs-recommendation-shelf-title
          >
            {title || campaign?.title}
          </h2>
        )}

        <ProductShelf>
          <Carousel
            id={id}
            itemsPerPage={itemsPerPage}
            variant={variant}
            infiniteMode={infiniteMode}
            controls={controls}
          >
            {items.map((item, index) => {
              const productId = item.isVariantOf.productGroupID

              return (
                <div
                  key={item.id}
                  data-fs-recommendation-shelf-item
                  {...(shouldAddAFAttr
                    ? {
                        'data-af-element': `${afElement}-product`,
                        'data-af-correlation-id': correlationId,
                        'data-af-campaign-id': campaignId,
                        'data-af-product-id': productId,
                        'data-af-onclick': !!productId,
                        'data-af-product-position': index + 1,
                      }
                    : {})}
                >
                  <CardComponent {...mapToCardProps(item, index)} />
                </div>
              )
            })}
          </Carousel>
        </ProductShelf>
      </ProductShelfSkeleton>
    </section>
  )
}
