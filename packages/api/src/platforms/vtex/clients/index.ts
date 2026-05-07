import type { GraphqlContext } from '..'
import { VtexCommerce } from './commerce'
import { IntelligentSearch } from './search'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options, ctx: GraphqlContext) => {
  const search = IntelligentSearch(options, ctx)
  const commerce = VtexCommerce(options, ctx)

  return {
    search,
    commerce,
  }
}
