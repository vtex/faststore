import { createEndpoint, fromInsideIframe, retain } from '@remote-ui/rpc'
import { createRoot, createRemoteRoot } from '@remote-ui/react'
import type { RemoteChannel } from '@remote-ui/core'
import { ExtensionPoints, OrderFormApi } from './types'

export type Endpoint = {
  render: (
    orderFormApi: OrderFormApi,
    receiver: RemoteChannel,
    extensionPoint: ExtensionPoints
  ) => Promise<void>
  getExtensionPoints: () => Promise<ExtensionPoints[]>
}

const endpoint = createEndpoint<Endpoint>(fromInsideIframe())
type RegisteredPoint = {
  extensionPoint: ExtensionPoints
  implementation: (orderFormApi: OrderFormApi) => any
}
let registeredPoints: RegisteredPoint[] = []

export const render = (
  extensionPoint: ExtensionPoints,
  callback: (orderFormApi: OrderFormApi) => any
) => {
  // Dummy validation just to make sure we're not overriding a registered extension point.
  const isAvailable = !registeredPoints.some(
    (x) => x.extensionPoint === extensionPoint
  )
  if (isAvailable) {
    registeredPoints.push({
      extensionPoint,
      implementation: (api) => callback(api),
    })
  } else {
    throw Error(`The extension point [${extensionPoint}] is not available.`)
  }
}

endpoint.expose({
  // Exposing the registered extenion points.
  async getExtensionPoints() {
    return registeredPoints.map((item) => item.extensionPoint)
  },
  /*
   * With the render procedure, we can call the render method passing the extension point,
   * and telling to the host app that we're creating the remote root and rendering the
   * custom implementation via the receiver.
   * We need to create a dedicated receiver for every extension point in our host app.
   */
  async render(
    orderFormApi: OrderFormApi,
    receiver: RemoteChannel,
    extensionPoint: ExtensionPoints
  ) {
    retain(receiver)
    retain(orderFormApi)
    const point = registeredPoints.find(
      (item) => item.extensionPoint === extensionPoint
    )
    if (point) {
      const remoteRoot = createRemoteRoot(receiver, {
        components: ['Button', 'Input', 'Box', 'Price', 'ProductImage'],
      })
      const root = createRoot(remoteRoot)
      root.render(point.implementation(orderFormApi))
      await remoteRoot.mount()
    }
  },
})
