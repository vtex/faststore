import { gql } from '@faststore/graphql-utils'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import { sendAnalyticsEvent } from '@faststore/sdk'
import { useEffect, useState } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import OutOfStock from 'src/components/product/OutOfStock'
import { DiscountBadge } from 'src/components/ui/Badge'
import Breadcrumb from 'src/components/ui/Breadcrumb'
import { ButtonBuy } from 'src/components/ui/Button'
import { ImageGallery } from 'src/components/ui/ImageGallery'
import Price from 'src/components/ui/Price'
import ProductTitle from 'src/components/ui/ProductTitle'
import QuantitySelector from 'src/components/ui/QuantitySelector'
import ShippingSimulation from 'src/components/ui/ShippingSimulation'
import Selectors from 'src/components/ui/SkuSelector'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProduct } from 'src/sdk/product/useProduct'
import { useSession } from 'src/sdk/session'

import ProductDetailsContent from '../ProducDetailsContent'
import Section from '../Section'
import styles from './product-details.module.scss'

interface Props {
  context: ProductDetailsFragment_ProductFragment
}

function ProductDetails({ context: staleProduct }: Props) {
  const { currency } = useSession()
  const [addQuantity, setAddQuantity] = useState(1)

  // Stale while revalidate the product for fetching the new price etc
  const { data, isValidating } = useProduct(staleProduct.id, {
    product: staleProduct,
  })

  if (!data) {
    throw new Error('NotFound')
  }

  const {
    product: {
      id,
      sku,
      gtin,
      name: variantName,
      brand,
      isVariantOf,
      isVariantOf: { name, productGroupID: productId, skuVariants },
      image: productImages,
      offers: {
        offers: [{ availability, price, listPrice, seller }],
        lowPrice,
      },
      breadcrumbList: breadcrumbs,
      additionalProperty,
    },
  } = data

  const buyDisabled = availability !== 'https://schema.org/InStock'

  const buyProps = useBuyButton({
    id,
    price,
    listPrice,
    seller,
    quantity: addQuantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
    },
  })

  useEffect(() => {
    sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
      name: 'view_item',
      params: {
        currency: currency.code as CurrencyCode,
        value: price,
        items: [
          {
            item_id: isVariantOf.productGroupID,
            item_name: isVariantOf.name,
            item_brand: brand.name,
            item_variant: sku,
            price,
            discount: listPrice - price,
            currency: currency.code as CurrencyCode,
            item_variant_name: variantName,
            product_reference_id: gtin,
          },
        ],
      },
    })
  }, [
    isVariantOf.productGroupID,
    isVariantOf.name,
    brand.name,
    sku,
    price,
    listPrice,
    currency.code,
    variantName,
    gtin,
  ])

  return (
    <Section
      className={`${styles.fsProductDetails} layout__content layout__section`}
    >
      <Breadcrumb breadcrumbList={breadcrumbs.itemListElement} />

      <section data-fs-product-details-body>
        <header data-fs-product-details-title data-fs-product-details-section>
          <ProductTitle
            title={<h1>{name}</h1>}
            label={
              <DiscountBadge listPrice={listPrice} spotPrice={lowPrice} big />
            }
            refNumber={productId}
          />
        </header>

        <ImageGallery data-fs-product-details-gallery images={productImages} />

        <section data-fs-product-details-info>
          <section
            data-fs-product-details-settings
            data-fs-product-details-section
          >
            <section data-fs-product-details-values>
              <div data-fs-product-details-prices>
                <Price
                  value={listPrice}
                  formatter={useFormattedPrice}
                  testId="list-price"
                  data-value={listPrice}
                  variant="listing"
                  classes="text__legend"
                  SRText="Original price:"
                />
                <Price
                  value={lowPrice}
                  formatter={useFormattedPrice}
                  testId="price"
                  data-value={lowPrice}
                  variant="spot"
                  classes="text__lead"
                  SRText="Sale Price:"
                />
              </div>
              {/* <div className="prices">
                <p className="price__old text__legend">{formattedListPrice}</p>
                <p className="price__new">{isValidating ? '' : formattedPrice}</p>
              </div> */}
              <QuantitySelector min={1} max={10} onChange={setAddQuantity} />
            </section>
            {skuVariants && (
              <Selectors
                slugsMap={skuVariants.slugsMap}
                availableVariations={skuVariants.availableVariations}
                activeVariations={skuVariants.activeVariations}
                data-fs-product-details-selectors
              />
            )}
            {/* NOTE: A loading skeleton had to be used to avoid a Lighthouse's
                non-composited animation violation due to the button transitioning its
                background color when changing from its initial disabled to active state.
                See full explanation on commit https://git.io/JyXV5. */}
            {isValidating ? (
              <AddToCartLoadingSkeleton />
            ) : (
              <ButtonBuy disabled={buyDisabled} {...buyProps}>
                Add to Cart
              </ButtonBuy>
            )}
            {!availability && (
              <OutOfStock
                onSubmit={(email) => {
                  console.info(email)
                }}
              />
            )}
          </section>

          <ShippingSimulation
            data-fs-product-details-section
            data-fs-product-details-shipping
            shippingItem={{
              id,
              quantity: addQuantity,
              seller: seller.identifier,
            }}
          />
        </section>

        <ProductDetailsContent />
      </section>
    </Section>
  )
}

function AddToCartLoadingSkeleton() {
  // Generated via https://skeletonreact.com/.
  return (
    <svg
      role="img"
      width="100%"
      height="48"
      aria-labelledby="loading-aria"
      viewBox="0 0 112 48"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      />
      <defs>
        <clipPath id="clip-path">
          <rect x="0" y="0" rx="2" ry="2" width="112" height="48" />
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.599964" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="1.59996" stopColor="#ecebeb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="2.59996" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const fragment = gql`
  fragment ProductDetailsFragment_product on StoreProduct {
    id: productID
    sku
    name
    gtin
    description

    isVariantOf {
      name
      productGroupID
      skuVariants {
        activeVariations
        slugsMap(dominantVariantName: "Color")
        availableVariations(dominantVariantName: "Color")
      }
    }

    image {
      url
      alternateName
    }

    brand {
      name
    }

    offers {
      lowPrice
      offers {
        availability
        price
        listPrice
        seller {
          identifier
        }
      }
    }

    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }

    # Contains necessary info to add this item to cart
    ...CartProductItem
  }
`

export default ProductDetails
