export interface PriceStateSource {
  available?: boolean | null
  reasonKey?: string | null
}

export interface PriceState {
  available: boolean
  reasonKey: string | null
}

const LOGIN_REASON = 'PRICE_REQUIRES_LOGIN'
const LOGIN_LABEL = 'Entre para ver o preço'
const FALLBACK_LABEL = 'calculando'

export const resolvePriceState = (
  source?: PriceStateSource | null
): PriceState => {
  if (source?.available === false) {
    return {
      available: false,
      reasonKey: source.reasonKey ?? null,
    }
  }

  return {
    available: true,
    reasonKey: null,
  }
}

export const priceReasonLabel = (reasonKey?: string | null) => {
  if (reasonKey === LOGIN_REASON) {
    return LOGIN_LABEL
  }

  return FALLBACK_LABEL
}
