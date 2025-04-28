import type { Resolver } from '..'
import type { UserOrderDeliveryOption } from '../../..'
import type { PromiseType } from '../../../typings'
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

export const UserOrder: Record<string, Resolver<Root>> = {
  orderId: ({ orderId }) => orderId,
  totals: ({ totals }) => totals,
  items: ({ items }) => items,
  shippingData: ({ shippingData }) => shippingData,
  paymentData: ({ paymentData }) => paymentData,
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

        const groupKey = `${selectedSla}|${deliveryChannel}|${deliveryCompany}|${seller}|${shippingEstimate}|${shippingEstimateDate}|${addressId}`

        const address = addresses?.find(
          (address) => address?.addressId === addressId
        )

        // Express delivery up to 1 business day / Standard shipping to SpringField / Pickup today
        const friendlyDeliveryOptionName =
          `${selectedSla} ${deliveryChannelsMapping[deliveryChannel as keyof typeof deliveryChannelsMapping] || ''} ${friendlyShippingEstimate} ${address?.neighborhood ? `to ${address?.neighborhood}` : ''}`.trim()

        // TODO check other totals like bundleItems etc
        const itemTotal =
          (item?.sellingPrice ?? 0) * (item?.quantity ?? 0) + (item?.tax ?? 0)

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
            name: item?.name || '',
            quantity: item?.quantity || 0,
            price: item?.price || 0,
            imageUrl: item?.imageUrl || '',
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
}
