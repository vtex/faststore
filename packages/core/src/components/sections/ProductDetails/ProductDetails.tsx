import { useEffect, useMemo, useState } from 'react'

import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'

import { gql } from '@generated'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useSession } from 'src/sdk/session'

import Section from '../Section'

import styles from './section.module.scss'

import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import { usePDP } from '../../../sdk/overrides/PageProvider'
import { ProductDetailsDefaultComponents } from './DefaultComponents'

import { createCategoryObject } from '../../../utils/createCategoryObject'

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
  notAvailableButton: {
    title: string
  }
  quantitySelector: {
    useUnitMultiplier?: boolean
  }
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
}

function ProductDetails({
  productTitle: {
    refNumber: showRefNumber,
    discountBadge: { showDiscountBadge, size: discountBadgeSize },
  },
  buyButton: { icon: buyButtonIcon, title: buyButtonTitle },
  shippingSimulator: {
    title: shippingSimulatorTitle,
    inputLabel: shippingSimulatorInputLabel,
    shippingOptionsTableTitle: shippingSimulatorOptionsTableTitle,
    link: { to: shippingSimulatorLinkUrl, text: shippingSimulatorLinkText },
  },
  productDescription: {
    title: productDescriptionDetailsTitle,
    initiallyExpanded: productDescriptionInitiallyExpanded,
    displayDescription: shouldDisplayProductDescription,
  },
  notAvailableButton: { title: notAvailableButtonTitle },
  quantitySelector,
  taxesConfiguration,
}: ProductDetailsProps) {
  const {
    DiscountBadge,
    ProductTitle,
    __experimentalImageGallery: ImageGallery,
    __experimentalShippingSimulation: ShippingSimulation,
    __experimentalNotAvailableButton: NotAvailableButton,
    __experimentalProductDescription: ProductDescription,
    __experimentalProductDetailsSettings: ProductDetailsSettings,
  } = useOverrideComponents<'ProductDetails'>()
  const { currency } = useSession()
  const context = usePDP()
  const { product, isValidating } = context?.data
  const [quantity, setQuantity] = useState(1)

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
      offers: [{ availability, price, listPrice, listPriceWithTaxes, seller }],
      lowPrice,
      lowPriceWithTaxes,
    },
  } = product

  useEffect(() => {
<<<<<<< HEAD
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
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
=======
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
            ...createCategoryObject(
              product.categories.map((item) => item.name)
            ),
          },
        ],
      },
>>>>>>> ab2a4f2fd (chore: update GA event "view_item"and "select_item)
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
    product.categories,
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
                    size={discountBadgeSize ?? DiscountBadge.props.size}
                    // Dynamic props shouldn't be overridable
                    // This decision can be reviewed later if needed
                    listPrice={
                      taxesConfiguration?.usePriceWithTaxes
                        ? listPriceWithTaxes
                        : listPrice
                    }
                    spotPrice={
                      taxesConfiguration?.usePriceWithTaxes
                        ? lowPriceWithTaxes
                        : lowPrice
                    }
                  />
                )
              }
              refNumber={showRefNumber && productId}
            />
          </header>
          <ImageGallery.Component
            data-fs-product-details-gallery
            {...ImageGallery.props}
            images={productImages}
          />
          <section data-fs-product-details-info>
            <section
              data-fs-product-details-settings
              data-fs-product-details-section
            >
              <ProductDetailsSettings.Component
                buyButtonTitle={buyButtonTitle}
                buyButtonIcon={buyButtonIcon}
                notAvailableButtonTitle={
                  notAvailableButtonTitle ?? NotAvailableButton.props.title
                }
                useUnitMultiplier={quantitySelector?.useUnitMultiplier ?? false}
                {...ProductDetailsSettings.props}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                quantity={quantity}
                setQuantity={setQuantity}
                product={product}
                isValidating={isValidating}
                taxesConfiguration={taxesConfiguration}
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
                  href:
                    shippingSimulatorLinkUrl ??
                    ShippingSimulation.props.idkPostalCodeLinkProps?.href,
                  children:
                    shippingSimulatorLinkText ??
                    ShippingSimulation.props.idkPostalCodeLinkProps?.children,
                }}
                productShippingInfo={{
                  id,
                  quantity,
                  seller: seller.identifier,
                }}
                title={shippingSimulatorTitle ?? ShippingSimulation.props.title}
                inputLabel={
                  shippingSimulatorInputLabel ??
                  ShippingSimulation.props.inputLabel
                }
                optionsLabel={
                  shippingSimulatorOptionsTableTitle ??
                  ShippingSimulation.props.optionsLabel
                }
              />
            )}
          </section>

          {shouldDisplayProductDescription && (
            <ProductDescription.Component
              initiallyExpanded={
                productDescriptionInitiallyExpanded ??
                ProductDescription.props.initiallyExpanded
              }
              descriptionData={[
                { content: description, title: productDescriptionDetailsTitle },
              ]}
              {...ProductDescription.props}
            />
          )}
        </section>
      </section>
    </Section>
  )
}

export const fragment = gql(`
  fragment ProductDetailsFragment_product on StoreProduct {
    id: productID
    sku
    name
    gtin
    categoryId
    categories {
      name
    }

    description
    unitMultiplier
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
      lowPriceWithTaxes
      offers {
        availability
        price
        priceWithTaxes
        listPrice
        listPriceWithTaxes
        seller {
          identifier
        }
      }
    }

    additionalProperty {
      propertyID
      name
      value
      valueReference
    }

    # Contains necessary info to add this item to cart
    ...CartProductItem
  }
`)

const OverridableProductDetails = getOverridableSection<typeof ProductDetails>(
  'ProductDetails',
  ProductDetails,
  ProductDetailsDefaultComponents
)

export default OverridableProductDetails
