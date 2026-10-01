import type { Session } from '@faststore/sdk'

function parseChannelRecord(
  raw: string | null | undefined
): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(raw || '{}')

    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // Malformed channel — reset below.
  }

  return {}
}

function readSalesChannel(channel: Record<string, unknown>): string {
  const value = channel.salesChannel

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

/**
 * Aligns `fs::session.channel` with a sales channel adopted from the orderForm
 * (e.g. after Quick Order) without revalidating the cart.
 *
 * Uses `sessionStore.setSilent` so we do not trigger `cartStore.set` mid-flight
 * (that race previously wiped SC-exclusive items). Marks the channel with
 * `salesChannelSource: 'orderForm'` so `validateSession` keeps it until the
 * cart is empty (see `releaseAdoptedSalesChannel`).
 */
export function syncSalesChannelFromOrderForm(
  salesChannel: string | null | undefined,
  readSession: () => Session,
  setSilent: (session: Session) => void
): boolean {
  if (salesChannel == null || salesChannel === '') {
    return false
  }

  const session = readSession()
  const channel = parseChannelRecord(session.channel)
  const nextSalesChannel = String(salesChannel)

  if (readSalesChannel(channel) === nextSalesChannel) {
    return false
  }

  setSilent({
    ...session,
    channel: JSON.stringify({
      ...channel,
      salesChannel: nextSalesChannel,
      hasOnlyDefaultSalesChannel: false,
      salesChannelSource: 'orderForm',
    }),
  })

  return true
}

/**
 * Drops the orderForm adoption marker once the cart has no items, so the next
 * `validateSession` lets Session Manager decide the sales channel again.
 */
export function releaseAdoptedSalesChannel(
  readSession: () => Session,
  setSilent: (session: Session) => void
): boolean {
  const session = readSession()
  const { salesChannelSource, ...channel } = parseChannelRecord(session.channel)

  if (salesChannelSource !== 'orderForm') {
    return false
  }

  setSilent({ ...session, channel: JSON.stringify(channel) })

  return true
}

/**
 * Applies the sales channel outcome of a `validateCart` to the session: adopt
 * the orderForm SC when the API returned one, release the adoption once the
 * cart is empty.
 */
export function syncSessionWithValidatedCart(
  {
    adoptedSalesChannel,
    itemCount,
  }: { adoptedSalesChannel: string | null | undefined; itemCount: number },
  readSession: () => Session,
  setSilent: (session: Session) => void
) {
  syncSalesChannelFromOrderForm(adoptedSalesChannel, readSession, setSilent)

  if (itemCount === 0) {
    releaseAdoptedSalesChannel(readSession, setSilent)
  }
}
