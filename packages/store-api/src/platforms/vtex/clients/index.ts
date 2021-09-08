import { VtexCommerce } from './commerce'
import { IntelligentSearch } from './is'
import type { Options } from '..'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options) => {
  const is = IntelligentSearch(options)
  const commerce = VtexCommerce(options)

  return {
    is,
    commerce,
  }
}
