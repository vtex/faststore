export interface PriceStateSource {
  available?: boolean | null
  reasonKey?: string | null
}

export interface PriceState {
  available: boolean
  reasonKey: string | null
}

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
