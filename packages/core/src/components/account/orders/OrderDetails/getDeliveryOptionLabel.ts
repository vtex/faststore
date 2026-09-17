import type { OrderDeliverySectionLabels } from './orderDetailsLabels'

type DeliveryOptionLabelData = {
  deliveryChannel?: string | null
  shippingEstimate?: string | null
  friendlyDeliveryOptionName?: string | null
  address?: { neighborhood?: string | null } | null
  pickupStoreInfo?: {
    address?: { neighborhood?: string | null } | null
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

function getLocalizedEstimate(
  estimate: string,
  labels: Required<OrderDeliverySectionLabels>
): string | undefined {
  const match = estimate.match(/^(\d+)(bd|d|h|m)$/)
  if (!match) {
    return undefined
  }

  const [, count, unit] = match as [string, string, EstimateUnit]
  const quantity: EstimateQuantity =
    count === '0' ? 'zero' : count === '1' ? 'one' : 'other'
  const template = labels[ESTIMATE_LABEL_KEYS[unit][quantity]]

  return template.replace('{count}', count)
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
    return option.friendlyDeliveryOptionName ?? ''
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
