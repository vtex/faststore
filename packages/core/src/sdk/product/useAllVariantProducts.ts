import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  ClientAllVariantProductsQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

const query = gql(`
  query ClientAllVariantProductsQuery($locator: [IStoreSelectedFacet!]!) {
      product(locator: $locator) {
      ...ProductSKUMatrixSidebarFragment_product
    }
  }
`)

type FormattedVariantProduct = {
  id: string
  name: string
  image: {
    url: string
    alternateName: string
  }
  inventory: number
  selectedCount: number
  availability: string
  offers: ClientAllVariantProductsQueryQuery['product']['isVariantOf']['skuVariants']['allVariantProducts'][0]['offers']
  price: number
  listPrice: number
  priceWithTaxes: number
  listPriceWithTaxes: number
  specifications: Record<string, string>
}

export const useAllVariantProducts = <
  T extends ClientAllVariantProductsQueryQuery
>(
  productID: string,
  enabled: boolean,
  processResponse: (data: FormattedVariantProduct[]) => void,
  fallbackData?: T
) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(
        `useAllVariantProducts: 'channel' from session is an empty string.`
      )
    }

    return {
      locator: [
        { key: 'id', value: productID },
        { key: 'channel', value: channel },
        { key: 'locale', value: locale },
      ],
    }
  }, [channel, locale, productID])

  return useQuery<FormattedVariantProduct[], ClientProductQueryQueryVariables>(
    query,
    variables,
    {
      fallbackData,
      revalidateOnMount: true,
      doNotRun: !enabled,
      onSuccess: (data: ClientAllVariantProductsQueryQuery) => {
        const formattedData =
          data.product.isVariantOf.skuVariants.allVariantProducts.map(
            (item) => {
              const specifications = item.additionalProperty.reduce<{
                [key: string]: any
              }>(
                (acc, prop) => ({
                  ...acc,
                  [prop.name.toLowerCase()]: prop.value,
                }),
                {}
              )

              const outOfStock =
                item.offers.offers[0].availability ===
                'https://schema.org/OutOfStock'

              return {
                id: item.sku,
                name: item.name,
                image: {
                  url: item.image[0].url,
                  alternateName: item.image[0].alternateName,
                },
                inventory: item.offers.offers[0].quantity,
                availability: outOfStock ? 'outofstock' : 'available',
                price: item.offers.offers[0].price,
                listPrice: item.offers.offers[0].listPrice,
                priceWithTaxes: item.offers.offers[0].priceWithTaxes,
                listPriceWithTaxes: item.offers.offers[0].listPriceWithTaxes,
                specifications,
                offers: item.offers,
                selectedCount: 0,
              }
            }
          )

        processResponse(
          formattedData.sort((a, b) => a.name.localeCompare(b.name))
        )
      },
    }
  )
}
