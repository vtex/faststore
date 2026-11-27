export interface PriceStateSource {
  available?: boolean | null
  reasonKey?: string | null
}

export interface PriceState {
  available: boolean
  reasonKey: string | null
}

const asPriceStateSource = (source: unknown): PriceStateSource | null => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return null
  }

  const record = source as Record<string, unknown>
  const available = record.available
  const reasonKey = record.reasonKey

  return {
    available: typeof available === 'boolean' ? available : null,
    reasonKey: typeof reasonKey === 'string' ? reasonKey : null,
  }
}

export const resolvePriceState = (source?: unknown): PriceState => {
  const parsed = asPriceStateSource(source)

  if (parsed?.available === false) {
    return {
      available: false,
      reasonKey: parsed.reasonKey ?? null,
    }
  }

  return {
    available: true,
    reasonKey: null,
  }
}
