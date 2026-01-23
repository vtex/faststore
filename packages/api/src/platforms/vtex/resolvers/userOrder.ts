import type { GraphqlResolver } from '..'
import type {
  Maybe,
  UserOrderCustomField,
  UserOrderDeliveryOption,
  UserOrderPriceTag,
} from '../../..'
import type { Query } from './query'
import { getLocalizedEstimates } from './shippingSLA'

type QueryUserOrder = PromiseType<ReturnType<typeof Query.userOrder>>

export type Root = QueryUserOrder

const deliveryChannelsMapping = {
  ['pickup-in-point']: 'Pickup',
  delivery: 'Delivery',
  pickup: 'Pickup',
  ['take-away']: 'Take away',
  ['']: '',
} as const

export const UserOrderResult: Record<string, GraphqlResolver<Root>> = {
  deliveryOptionsData: (root) => {
    const { shippingData, items } = root
    const logisticsInfo = shippingData?.logisticsInfo || []
    const addresses = shippingData?.selectedAddresses ||
      shippingData?.availableAddresses || [shippingData?.address]

    const groupedDeliveryOptions = logisticsInfo.reduce(
      (acc, logisticsItem) => {
        const selectedSla = logisticsItem?.selectedSla || '' // Normal / Express
        const deliveryChannel =
          logisticsItem?.selectedDeliveryChannel ||
          logisticsItem?.deliveryChannel ||
          ''
        const deliveryCompany = logisticsItem?.deliveryCompany || '' // Correios / Fedex
        const deliveryWindow = logisticsItem?.deliveryWindow
        const pickupStoreInfo = logisticsItem?.pickupStoreInfo
        const shippingEstimate = logisticsItem?.shippingEstimate || '' // 1bd
        const friendlyShippingEstimate = logisticsItem?.shippingEstimate
          ? getLocalizedEstimates(logisticsItem?.shippingEstimate) // e.g. transform 3bd into Up to 3 business days
          : ''

        const shippingEstimateDate = logisticsItem?.shippingEstimateDate || '' // 2023-10-02T00:00:00Z
        const addressId = logisticsItem?.addressId || '' // 5230338247839

        const itemIndex = logisticsItem?.itemIndex ?? 0
        const item = items?.[itemIndex]
        const seller = item?.seller || ''

        const groupKey = `${selectedSla}|${deliveryChannel}|${deliveryCompany}|${seller}|${shippingEstimate}|${shippingEstimateDate}|${addressId}|${deliveryWindow?.startDateUtc}|${deliveryWindow?.endDateUtc}`

        const address = addresses?.find(
          (address) => address?.addressId === addressId
        )

        const friendlyDeliveryOptionName =
          `${deliveryChannelsMapping[deliveryChannel as keyof typeof deliveryChannelsMapping] || ''} ${friendlyShippingEstimate} ${address?.neighborhood ? `to ${address?.neighborhood}` : ''}`.trim()

        // TODO check other totals like bundleItems etc
        const { taxPriceTagsTotal, taxPriceTags } = filterTaxPriceTags(
          (item?.priceTags ?? []) as UserOrderPriceTag[]
        )

        const itemTotal =
          (item?.sellingPrice ?? 0) * (item?.quantity ?? 0) +
          (item?.tax ?? 0) +
          (taxPriceTagsTotal ?? 0)

        if (!acc[groupKey]) {
          acc[groupKey] = {
            // static fields
            selectedSla,
            deliveryChannel,
            deliveryCompany,
            deliveryWindow,
            shippingEstimate,
            shippingEstimateDate,
            seller,
            friendlyShippingEstimate,
            friendlyDeliveryOptionName,
            address,
            pickupStoreInfo,
            // dynamic fields
            quantityOfDifferentItems: 0,
            total: 0,
            items: [],
          }
        }

        if (acc[groupKey]) {
          acc[groupKey].items?.push({
            id: item?.id || '',
            uniqueId: item?.uniqueId || '',
            name: item?.name || '',
            quantity: item?.quantity || 0,
            price: item?.price || 0,
            sellingPrice: item?.sellingPrice || 0,
            imageUrl: item?.imageUrl || '',
            taxPriceTags: taxPriceTags ?? [],
            taxPriceTagsTotal: taxPriceTagsTotal ?? 0,
            tax: item?.tax || 0,
            total: itemTotal,
          })

          acc[groupKey].quantityOfDifferentItems =
            (acc[groupKey].quantityOfDifferentItems ?? 0) + 1
          acc[groupKey].total = (acc[groupKey].total ?? 0) + itemTotal
        }

        return acc
      },
      {} as Record<string, UserOrderDeliveryOption>
    )

    const deliveryOptions = Object.values(groupedDeliveryOptions)

    const contactInformation = shippingData?.contactInformation?.[0]
    const contact = {
      name:
        `${contactInformation?.firstName ?? ''} ${contactInformation?.lastName ?? ''}`.trim() ||
        deliveryOptions?.[0]?.address?.receiverName ||
        '',
      email: contactInformation?.email || '',
      phone: contactInformation?.phone || '',
    }

    return {
      deliveryOptions,
      contact,
    }
  },
  customFields: (root) => {
    const customFields = root?.customData?.customFields || []
    return (
      Object.values(
        customFields.reduce(
          (
            acc: Record<
              string,
              {
                type: string
                id: string
                fields: UserOrderCustomField['fields']
              }
            >,
            entry: Maybe<UserOrderCustomField>
          ) => {
            const type = entry?.linkedEntity?.type || ''
            const id = entry?.linkedEntity?.id || ''
            const key = `${type}|${id || ''}`
            if (!acc[key]) {
              acc[key] = { type, id, fields: [] }
            }
            acc[key].fields.push(...(entry?.fields || []))
            return acc
          },
          {}
        )
      ) || []
    )
    // Example of custom fields
    //   return [
    //     {
    //       type: 'item',
    //       id: '9009169',
    //       fields: [
    //         {
    //           name: 'costCenter',
    //           value: 'CC1',
    //           refId: 'externalId',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'item',
    //       id: 'ECEAC03EBA2B4BBFA7E899CD4CA5121B',
    //       fields: [
    //         {
    //           name: 'costCenter',
    //           value: 'CC2',
    //           refId: 'externalId',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'address',
    //       id: 'work-A1',
    //       fields: [
    //         {
    //           name: 'desktop',
    //           value: 'A1',
    //           refId: 'externalId',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'order',
    //       id: '',
    //       fields: [
    //         {
    //           name: 'poNumber',
    //           value: '111222333',
    //           refId: 'externalId',
    //         },
    //         {
    //           name: 'release',
    //           value: '123',
    //           refId: 'externalId',
    //         },
    //       ],
    //     },
    //   ]
  },
}

// logic copied from https://github.com/vtex/my-orders/blob/3271bdd4216851fb21b64093769d73183868e362/react/components/Order/ChangeSummary/ChangeV2/shared/filterPriceTags.js#L59-L60
export function filterTaxPriceTags(priceTags: UserOrderPriceTag[]) {
  const multiplier = 100

  const taxPriceTags = priceTags.filter((priceTag) =>
    priceTag?.name?.includes('TAX')
  )

  const taxPriceTagsTotal = taxPriceTags.reduce(
    (acc, curr) => acc + (curr.rawValue ? curr.rawValue * multiplier : 0),
    0
  )

  return {
    taxPriceTags,
    taxPriceTagsTotal,
  }
}
