import { useEffect, useState } from 'react'

import { gql } from '@faststore/graphql-utils'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import {
  Link as UILink,
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
} from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import { useProduct } from 'src/sdk/product/useProduct'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { AnalyticsItem } from 'src/sdk/analytics/types'

import Section from '../Section'
import OutOfStock from 'src/components/product/OutOfStock'
import ImageGallery from 'src/components/ui/ImageGallery'
import ShippingSimulation from 'src/components/ui/ShippingSimulation'
import { ProductDetailsSettings } from 'src/components/ui/ProductDetails'

import ProductDetailsContent from '../ProducDetailsContent'

import styles from './section.module.scss'

interface ProductDetailsContextProps {
  context: ProductDetailsFragment_ProductFragment
}

export interface ProductDetailsProps {
  productTitle: {
    discountBadge?: boolean
    refNumber?: boolean
  }
  buyButton: {
    title?: string
    icon: {
      icon: string
      alt?: string
    }
  }
  shippingSimulator: {
    title?: string
    inputLabel?: string
    link: {
      to: string
      text?: string
    }
  }
  productDetailsContent: {
    initiallyExpanded: 'first' | 'all' | 'none'
    details: {
      displayDescription?: boolean
      title?: string
    }
  }
}

function ProductDetails({
  context: staleProduct,
  productTitle: { refNumber: showRefNumber, discountBadge: showDiscountBadge },
  buyButton: {
    title: buyButtonTitle,
    icon: { icon: buyButtonIconName, alt: buyButtonIconAlt },
  },
  shippingSimulator: {
    title: shippingSimulatorTitle,
    inputLabel: shippingSimulatorInputLabel,
    link: { to: shippingSimulatorLinkUrl, text: shippingSimulatorLinkText },
  },
  productDetailsContent: {
    initiallyExpanded: productDetailsContentInitiallyExpanded,
    details: {
      title: productDetailsContentDetailsTitle,
      displayDescription: productDetailsContentDisplayDescription,
    },
  },
}: ProductDetailsProps & ProductDetailsContextProps) {
  const { currency } = useSession()
  const [quantity, setQuantity] = useState(1)

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
      isVariantOf: { name, productGroupID: productId },
      image: productImages,
      offers: {
        offers: [{ availability, price, listPrice, seller }],
        lowPrice,
      },
    },
  } = data

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
      className={`${styles.section} section-product-details layout__content layout__section`}
    >
      <section data-fs-product-details-body>
        <header data-fs-product-details-title data-fs-product-details-section>
          <UIProductTitle
            title={<h1>{name}</h1>}
            label={
              showDiscountBadge && (
                <UIDiscountBadge
                  listPrice={listPrice}
                  spotPrice={lowPrice}
                  size="big"
                />
              )
            }
            refNumber={showRefNumber && productId}
          />
        </header>

        <ImageGallery data-fs-product-details-gallery images={productImages} />

        <section data-fs-product-details-info>
          <section
            data-fs-product-details-settings
            data-fs-product-details-section
          >
            {availability ? (
              <ProductDetailsSettings
                product={data.product}
                isValidating={isValidating}
                buyButtonTitle={buyButtonTitle}
                quantity={quantity}
                setQuantity={setQuantity}
                buyButtonIcon={buyButtonIconName || buyButtonIconAlt}
              />
            ) : (
              <OutOfStock />
            )}
          </section>

          {availability && (
            <ShippingSimulation
              data-fs-product-details-section
              data-fs-product-details-shipping
              productShippingInfo={{
                id,
                quantity,
                seller: seller.identifier,
              }}
              formatter={useFormattedPrice}
              title={shippingSimulatorTitle}
              inputLabel={shippingSimulatorInputLabel}
              idkPostalCodeLinkProps={
                <UILink href={shippingSimulatorLinkUrl}>
                  {shippingSimulatorLinkText}
                </UILink>
              }
            />
          )}

          <ProductDetailsContent
            labels={{ description: productDetailsContentDetailsTitle }}
            initiallyExpanded={productDetailsContentInitiallyExpanded}
            shouldDisplayDescription={productDetailsContentDisplayDescription}
          />
        </section>
      </section>
    </Section>
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
        slugsMap
        availableVariations
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

    # Contains necessary info to add this item to cart
    ...CartProductItem
  }
`

export default ProductDetails
