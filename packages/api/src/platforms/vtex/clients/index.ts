import type { Context, Options } from '..'
import { VtexCommerce } from './commerce'
import { Profile } from './profile'
import { IntelligentSearch } from './search'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options, ctx: Context) => {
  const search = IntelligentSearch(options, ctx)
  const commerce = VtexCommerce(options, ctx)
  const profile = Profile(options, ctx)

  return {
    search,
    commerce,
    profile,
  }
}
