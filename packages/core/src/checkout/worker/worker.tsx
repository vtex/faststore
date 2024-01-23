import {
  createRemoteReactComponent,
  createRemoteRoot,
  createRoot,
} from '@remote-ui/react'
import type { RemoteChannel } from '@remote-ui/core'
import { retain } from '@remote-ui/rpc'
import { ExtensionPoints } from '../sdk/lib'

const Root = createRemoteReactComponent<'Root'>('Root')
const CouponButton = createRemoteReactComponent<'CouponButton'>('CouponButton')

const components = { Root, CouponButton }

export async function run(
  receiver: RemoteChannel,
  extensionPoint: ExtensionPoints
) {
  retain(receiver)

  const remoteRoot = createRemoteRoot(receiver, {
    components: [
      Root,
      CouponButton,
      'BeforeCartList',
      'Footer',
      'BeforeSummary',
      'CouponButton',
      'AfterSummary',
      'AfterFinishOrder',
      'Component',
    ],
  })

  const root = createRoot(remoteRoot)
  const Component = components[extensionPoint]
  root.render(<Component />)
  await remoteRoot.mount()
}
