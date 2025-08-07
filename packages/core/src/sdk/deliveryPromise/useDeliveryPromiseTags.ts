import { getGlobalSettings } from 'src/utils/globalSettings'
import {
  DELIVERY_OPTIONS_FACET_KEY,
  DYNAMIC_ESTIMATE_FACET_KEY,
  useDeliveryPromise,
} from './useDeliveryPromise'

type Tag = {
  name: string | null
  typeName: string
  value: string
}

export function useDeliveryPromiseTags(productTags: Tag[]) {
  const {
    deliveryPromise: {
      tags: { option: deliveryPromiseTag, deliveryOptionId } = {},
    } = {},
  } = getGlobalSettings()
  const { isEnabled: isDeliveryPromiseEnabled, getDynamicEstimateLabel } =
    useDeliveryPromise()

  const productTag =
    deliveryPromiseTag === 'delivery_option'
      ? productTags?.find(
          ({ typeName, value }) =>
            typeName === DELIVERY_OPTIONS_FACET_KEY &&
            value === deliveryOptionId
        )?.name
      : deliveryPromiseTag === 'dynamic_estimate'
        ? getDynamicEstimateLabel(
            productTags?.find(
              ({ typeName }) => typeName === DYNAMIC_ESTIMATE_FACET_KEY
            )?.value
          )
        : undefined

  const shouldDisplayDeliveryPromiseTags =
    isDeliveryPromiseEnabled && !!productTag

  return {
    productTag,
    shouldDisplayDeliveryPromiseTags,
    deliveryPromiseTag,
  }
}
