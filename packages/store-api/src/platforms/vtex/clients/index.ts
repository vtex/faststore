import { VtexCommerce } from './commerce'
import { IntelligentSearch } from './search'
import type { Options } from '..'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options) => {
  const search = IntelligentSearch(options)
  const commerce = VtexCommerce(options)

  return {
    search,
    commerce,
  }
}
