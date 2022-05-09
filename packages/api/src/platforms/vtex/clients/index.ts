import { VtexCommerce } from './commerce'
import { IntelligentSearch } from './search'
import { SP } from './sp'
import type { Context, Options } from '..'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options, ctx: Context) => {
  const search = IntelligentSearch(options, ctx)
  const commerce = VtexCommerce(options, ctx)
  const sp = SP(options, ctx)

  return {
    search,
    commerce,
    sp,
  }
}
