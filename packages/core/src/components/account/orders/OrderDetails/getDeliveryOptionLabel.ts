import type { OrderDeliverySectionLabels } from './orderDetailsLabels'

type DeliveryOptionLabelData = {
  selectedSla?: string | null
  deliveryChannel?: string | null
  deliveryCompany?: string | null
  seller?: string | null
  shippingEstimate?: string | null
  shippingEstimateDate?: string | null
  friendlyDeliveryOptionName?: string | null
  address?: {
    neighborhood?: string | null
    addressId?: string | null
  } | null
  pickupStoreInfo?: {
    address?: { neighborhood?: string | null } | null
  } | null
  deliveryWindow?: {
    startDateUtc?: string | null
    endDateUtc?: string | null
  } | null
}

type EstimateUnit = 'bd' | 'd' | 'h' | 'm'
type EstimateQuantity = 'zero' | 'one' | 'other'

const ESTIMATE_LABEL_KEYS: Record<
  EstimateUnit,
  Record<EstimateQuantity, keyof OrderDeliverySectionLabels>
> = {
  bd: {
    zero: 'businessDaysZeroTemplate',
    one: 'businessDaysOneTemplate',
    other: 'businessDaysOtherTemplate',
  },
  d: {
    zero: 'daysZeroTemplate',
    one: 'daysOneTemplate',
    other: 'daysOtherTemplate',
  },
  h: {
    zero: 'hoursZeroTemplate',
    one: 'hoursOneTemplate',
    other: 'hoursOtherTemplate',
  },
  m: {
    zero: 'minutesZeroTemplate',
    one: 'minutesOneTemplate',
    other: 'minutesOtherTemplate',
  },
}

const CHANNEL_LABEL_KEYS: Record<
  string,
  keyof OrderDeliverySectionLabels | undefined
> = {
  delivery: 'deliveryChannelLabel',
  pickup: 'pickupChannelLabel',
  'pickup-in-point': 'pickupChannelLabel',
  'take-away': 'takeAwayChannelLabel',
  '': undefined,
}

function isEstimateUnit(unit: string): unit is EstimateUnit {
  return unit === 'bd' || unit === 'd' || unit === 'h' || unit === 'm'
}

function getLocalizedEstimate(
  estimate: string,
  labels: Required<OrderDeliverySectionLabels>
): string | undefined {
  const count = estimate.split(/\D+/)[0]
  const unit = estimate.split(/\d+/)[1]

  if (count === '' || Number.isNaN(Number(count)) || !isEstimateUnit(unit)) {
    return undefined
  }

  let quantity: EstimateQuantity = 'other'
  if (Number(count) === 0) {
    quantity = 'zero'
  } else if (Number(count) < 2) {
    quantity = 'one'
  }

  const template = labels[ESTIMATE_LABEL_KEYS[unit][quantity]]

  return template.replace('{count}', count)
}

export function getDeliveryOptionKey(option: DeliveryOptionLabelData): string {
  return [
    option.selectedSla,
    option.deliveryChannel,
    option.deliveryCompany,
    option.seller,
    option.shippingEstimate,
    option.shippingEstimateDate,
    option.address?.addressId,
    option.deliveryWindow?.startDateUtc,
    option.deliveryWindow?.endDateUtc,
  ].join('|')
}

export function getDeliveryOptionLabel(
  option: DeliveryOptionLabelData,
  labels: Required<OrderDeliverySectionLabels>
): string {
  const channelLabelKey =
    CHANNEL_LABEL_KEYS[option.deliveryChannel ?? 'unknown']
  const estimate = option.shippingEstimate
    ? getLocalizedEstimate(option.shippingEstimate, labels)
    : undefined

  if (channelLabelKey === undefined && option.deliveryChannel) {
    return option.friendlyDeliveryOptionName ?? ''
  }

  if (!estimate) {
    return channelLabelKey
      ? labels[channelLabelKey]
      : (option.friendlyDeliveryOptionName ?? '')
  }

  const neighborhood =
    option.address?.neighborhood ??
    option.pickupStoreInfo?.address?.neighborhood
  const destination = neighborhood
    ? labels.toNeighborhoodTemplate.replace('{neighborhood}', neighborhood)
    : ''

  return [channelLabelKey ? labels[channelLabelKey] : '', estimate, destination]
    .filter(Boolean)
    .join(' ')
}
