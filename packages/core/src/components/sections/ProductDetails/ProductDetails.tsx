import { useEffect, useState } from 'react'

import { gql } from '@faststore/graphql-utils'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import { useSession } from 'src/sdk/session'
import { useProduct } from 'src/sdk/product/useProduct'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { AnalyticsItem } from 'src/sdk/analytics/types'

import Section from '../Section'
import OutOfStock from 'src/components/product/OutOfStock'
import ProductDescription from 'src/components/ui/ProductDescription'
import { ProductDetailsSettings } from 'src/components/ui/ProductDetails'

import styles from './section.module.scss'

import {
  Components,
  Props,
} from 'src/components/sections/ProductDetails/Overrides'

const {
  ProductTitle,
  DiscountBadge,
  __experimentalImageGallery: ImageGallery,
  __experimentalShippingSimulation: ShippingSimulation,
} = Components

interface ProductDetailsContextProps {
  context: ProductDetailsFragment_ProductFragment
}

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
}

function ProductDetails({
  context: staleProduct,
  productTitle: {
    refNumber: showRefNumber,
    discountBadge: {
      showDiscountBadge,
      size: discountBadgeSize = Props['DiscountBadge'].size,
    },
  },
  buyButton: { icon: buyButtonIcon, title: buyButtonTitle },
  shippingSimulator: {
    title: shippingSimulatorTitle = Props['__experimentalShippingSimulation']
      .title,
    inputLabel: shippingSimulatorInputLabel = Props[
      '__experimentalShippingSimulation'
    ].inputLabel,
    shippingOptionsTableTitle: shippingSimulatorOptionsTableTitle = Props[
      '__experimentalShippingSimulation'
    ].optionsLabel,
    link: {
      to: shippingSimulatorLinkUrl = Props['__experimentalShippingSimulation']
        .idkPostalCodeLinkProps?.href,
      text: shippingSimulatorLinkText = Props[
        '__experimentalShippingSimulation'
      ].idkPostalCodeLinkProps?.children,
    },
  },
  productDescription: {
    title: productDescriptionDetailsTitle,
    initiallyExpanded: productDescriptionInitiallyExpanded,
    displayDescription: shouldDisplayProductDescription,
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
      description,
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
      <section data-fs-product-details>
        <section data-fs-product-details-body>
          <header data-fs-product-details-title data-fs-product-details-section>
            <ProductTitle
              // TODO: We should review this prop. There's now way to override the title and use the dynamic name value.
              // Maybe passing a ProductTitleHeader component as a prop would be better, as it would be overridable.
              // Maybe now it's worth to make title always a h1 and receive only the name, as it would be easier for users to override.
              title={<h1>{name}</h1>}
              {...Props['ProductTitle']}
              label={
                showDiscountBadge && (
                  <DiscountBadge
                    {...Props['DiscountBadge']}
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
          <ImageGallery
            data-fs-product-details-gallery
            {...Props['__experimentalImageGallery']}
            images={productImages}
          />
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
                  buyButtonIcon={buyButtonIcon}
                />
              ) : (
                <OutOfStock />
              )}
            </section>

            {availability && (
              <ShippingSimulation
                data-fs-product-details-section
                data-fs-product-details-shipping
                formatter={useFormattedPrice}
                {...Props['__experimentalShippingSimulation']}
                idkPostalCodeLinkProps={{
                  ...Props['idkPostalCodeLinkProps'],
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
