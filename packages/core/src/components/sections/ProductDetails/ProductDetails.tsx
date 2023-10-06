import { useEffect, useState, useMemo } from 'react'

import { gql } from '@faststore/graphql-utils'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import { sendAnalyticsEvent } from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useSession } from 'src/sdk/session'

import Section from '../Section'
import ProductDescription from 'src/components/ui/ProductDescription'
import { ProductDetailsSettings } from 'src/components/ui/ProductDetails'

import styles from './section.module.scss'

import {
  DiscountBadge,
  ProductTitle,
  __experimentalImageGallery as ImageGallery,
  __experimentalShippingSimulation as ShippingSimulation,
  __experimentalNotAvailableButton as NotAvailableButton,
} from 'src/components/sections/ProductDetails/Overrides'

import { usePDP } from 'src/sdk/overrides/PageProvider'

export interface ProductDetailsProps {
  productTitle: {
    refNumber: boolean
    discountBadge: {
      size: 'big' | 'small'
      showDiscountBadge: boolean
    }
  }
  buyButton: {
    title: string
    icon: {
      alt: string
      icon: string
    }
  }
  shippingSimulator: {
    title: string
    inputLabel: string
    link: {
      to: string
      text: string
    }
    shippingOptionsTableTitle: string
  }
  productDescription: {
    title: string
    displayDescription: boolean
    initiallyExpanded: 'first' | 'all' | 'none'
  }
  imageGallery: {
    imagePosition: 'top' | 'center' | 'bottom'
  }
  notAvailableButton: {
    title: string
  }
}

function ProductDetails({
  productTitle: {
    refNumber: showRefNumber,
    discountBadge: {
      showDiscountBadge,
      size: discountBadgeSize = DiscountBadge.props.size,
    },
  },
  buyButton: { icon: buyButtonIcon, title: buyButtonTitle },
  shippingSimulator: {
    title: shippingSimulatorTitle = ShippingSimulation.props.title,
    inputLabel: shippingSimulatorInputLabel = ShippingSimulation.props
      .inputLabel,
    shippingOptionsTableTitle:
      shippingSimulatorOptionsTableTitle = ShippingSimulation.props
        .optionsLabel,
    link: {
      to: shippingSimulatorLinkUrl = ShippingSimulation.props
        .idkPostalCodeLinkProps?.href,
      text: shippingSimulatorLinkText = ShippingSimulation.props
        .idkPostalCodeLinkProps?.children,
    },
  },
  productDescription: {
    title: productDescriptionDetailsTitle,
    initiallyExpanded: productDescriptionInitiallyExpanded,
    displayDescription: shouldDisplayProductDescription,
  },
  imageGallery: { imagePosition = ImageGallery.props.imagePosition },
  notAvailableButton: {
    title: notAvailableButtonTitle = NotAvailableButton.props.title,
  },
}: ProductDetailsProps) {
  const { currency } = useSession()
  const [quantity, setQuantity] = useState(1)
  const context = usePDP()
  const { product, isValidating } = context?.data

  if (!product) {
    throw new Error('NotFound')
  }

  const {
    id,
    sku,
    gtin,
    name: variantName,
    brand,
    isVariantOf,
    description,
    isVariantOf: { name, productGroupID: productId },
    image: productImages,
    offers: {
      offers: [{ availability, price, listPrice, seller }],
      lowPrice,
    },
  } = product

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

  const outOfStock = useMemo(
    () => availability === 'https://schema.org/OutOfStock',
    [availability]
  )

  return (
    <Section className={`${styles.section} section-product-details`}>
      <section data-fs-product-details>
        <section data-fs-product-details-body data-fs-content="product-details">
          <header data-fs-product-details-title data-fs-product-details-section>
            <ProductTitle.Component
              // TODO: We should review this prop. There's now way to override the title and use the dynamic name value.
              // Maybe passing a ProductTitleHeader component as a prop would be better, as it would be overridable.
              // Maybe now it's worth to make title always a h1 and receive only the name, as it would be easier for users to override.
              title={<h1>{name}</h1>}
              {...ProductTitle.props}
              label={
                showDiscountBadge && (
                  <DiscountBadge.Component
                    {...DiscountBadge.props}
                    size={discountBadgeSize}
                    // Dynamic props shouldn't be overridable
                    // This decision can be reviewed later if needed
                    listPrice={listPrice}
                    spotPrice={lowPrice}
                  />
                )
              }
              refNumber={showRefNumber && productId}
            />
          </header>
          <ImageGallery.Component
            data-fs-product-details-gallery
            {...ImageGallery.props}
            imagePosition={imagePosition}
            images={productImages}
          />
          <section data-fs-product-details-info>
            <section
              data-fs-product-details-settings
              data-fs-product-details-section
            >
              <ProductDetailsSettings
                product={product}
                isValidating={isValidating}
                buyButtonTitle={buyButtonTitle}
                quantity={quantity}
                setQuantity={setQuantity}
                buyButtonIcon={buyButtonIcon}
                notAvailableButtonTitle={notAvailableButtonTitle}
              />
            </section>

            {!outOfStock && (
              <ShippingSimulation.Component
                data-fs-product-details-section
                data-fs-product-details-shipping
                formatter={useFormattedPrice}
                {...ShippingSimulation.props}
                idkPostalCodeLinkProps={{
                  ...ShippingSimulation.props.idkPostalCodeLinkProps,
                  href: shippingSimulatorLinkUrl,
                  children: shippingSimulatorLinkText,
                }}
                productShippingInfo={{
                  id,
                  quantity,
                  seller: seller.identifier,
                }}
                title={shippingSimulatorTitle}
                inputLabel={shippingSimulatorInputLabel}
                optionsLabel={shippingSimulatorOptionsTableTitle}
              />
            )}
          </section>

          {shouldDisplayProductDescription && (
            <ProductDescription
              initiallyExpanded={productDescriptionInitiallyExpanded}
              descriptionData={[
                { title: productDescriptionDetailsTitle, content: description },
              ]}
            />
          )}
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
