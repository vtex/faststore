import type { Resolver } from '..'

type Unit = 'bd' | 'd' | 'h' | 'm'
const units = ['bd', 'd', 'h', 'm'] as const

const isUnit = (x: any): x is Unit => units.includes(x)

const localizedEstimates: Record<string, Record<string, string>> = {
  bd: {
    0: 'Today',
    1: 'In 1 business day',
    other: `Up to # business days`,
  },
  d: {
    0: 'Today',
    1: 'In 1 day',
    other: 'Up to # days',
  },
  h: {
    0: 'Now',
    1: 'In 1 hour',
    other: 'Up to # hours',
  },
  m: {
    0: 'Now',
    1: 'In 1 minute',
    other: 'Up to # minutes',
  },
}

/**
 * Transforms estimate (e.g 3bd) into friendly format (e.g Up to 3 business days)
 * based on https://github.com/vtex-apps/shipping-estimate-translator/blob/13e17055d6353dd3f3f4c31bae77ab049002809b/messages/en.json
 */

export const getLocalizedEstimates = (estimate: string): string => {
  const [amount, unit] = [estimate.split(/\D+/)[0], estimate.split(/[0-9]+/)[1]]

  const isAmountNumber = amount !== '' && !Number.isNaN(Number(amount))
  const isUnitValid = isUnit(unit)

  if (!isAmountNumber || !isUnitValid) {
    return ''
  }

  const amountKey = Number(amount) < 2 ? Number(amount) : 'other'

  return localizedEstimates[unit][amountKey].replace('#', amount) ?? ''
}

type Root = {
  name?: string
  friendlyName?: string
  price?: number
  shippingEstimate?: string
}

export const ShippingSLA: Record<string, Resolver<Root>> = {
  carrier: (root) => root?.friendlyName ?? root?.name ?? '',
  price: (root) => (root?.price ? root.price / 100 : root?.price),
  localizedEstimates: (root) =>
    root?.shippingEstimate ? getLocalizedEstimates(root.shippingEstimate) : '',
}
