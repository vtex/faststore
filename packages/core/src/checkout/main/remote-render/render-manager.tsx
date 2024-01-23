import { Controller } from '@remote-ui/react/host'
import type { Endpoint } from '@remote-ui/rpc'
import type { Endpoint as CheckoutEndpoint } from '../../sdk/lib'
import { type ExtensionPoints } from '../../sdk/lib'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

type Api = {
  registeredExtensionPoints: ExtensionPoints[]
  remoteEndpoint?: Endpoint<CheckoutEndpoint>
  controller?: Controller
}

type ContextApi = Api & {
  register: (api: Api) => void
}

const RemoteContext = createContext<ContextApi>({
  register: () => {},
  registeredExtensionPoints: [],
})

export const RenderManagerProvider = ({ children }: PropsWithChildren) => {
  const [api, setApi] = useState<Api>({
    registeredExtensionPoints: [],
  })

  const register = (api: Api) => setApi(api)

  return (
    <RemoteContext.Provider value={{ ...api, register }}>
      {children}
    </RemoteContext.Provider>
  )
}

export const useRenderManager = () => useContext(RemoteContext)
