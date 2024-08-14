import { VtexCommerce } from './commerce'
import { IntelligentSearch } from './search'
import type { Context, Options } from '..'
import { BuyerOrg } from './buyerOrg'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options, ctx: Context) => {
  const search = IntelligentSearch(options, ctx)
  const commerce = VtexCommerce(options, ctx)
  const buyerOrg = BuyerOrg(options, ctx)

  return {
    search,
    commerce,
    buyerOrg
  }
}
