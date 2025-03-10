import { VtexCommerce } from './commerce'
import { AppsIO } from './apps'
import type { Context, Options } from '..'

export type Clients = ReturnType<typeof getClients>

export const getClients = (options: Options, ctx: Context) => {
  const apps = AppsIO(options, ctx)
  const commerce = VtexCommerce(options, ctx)

  return {
    apps,
    commerce,
  }
}
