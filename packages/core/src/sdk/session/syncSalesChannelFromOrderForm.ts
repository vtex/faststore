import type { Session } from '@faststore/sdk'

/**
 * Aligns `fs::session.channel` with a sales channel adopted from the orderForm
 * (e.g. after Quick Order) without revalidating the cart.
 *
 * Uses `sessionStore.setSilent` so we do not trigger `cartStore.set` mid-flight
 * (that race previously wiped SC-exclusive items). Marks the channel as
 * explicit (`hasOnlyDefaultSalesChannel: false`) so `validateSession` keeps it.
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
  let channel: Record<string, unknown> = {}

  try {
    channel = JSON.parse(session.channel || '{}') as Record<string, unknown>
  } catch {
    channel = {}
  }

  if (String(channel.salesChannel ?? '') === String(salesChannel)) {
    return false
  }

  setSilent({
    ...session,
    channel: JSON.stringify({
      ...channel,
      salesChannel: String(salesChannel),
      hasOnlyDefaultSalesChannel: false,
    }),
  })

  return true
}
