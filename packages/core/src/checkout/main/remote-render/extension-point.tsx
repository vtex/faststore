import {
  RemoteRenderer,
  createRemoteReceiver,
  createController,
} from '@remote-ui/react/host'
import { ExtensionPoints } from '../../sdk/lib'
import { useEffect, useMemo } from 'react'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useRemoteRenderer } from './use-remote-renderer'

type ExtensionPointProps = {
  element?: JSX.Element | null
  extension: ExtensionPoints
  worker: ReturnType<typeof useRemoteRenderer>
}

export function ExtensionPoint({
  element = null,
  extension: extensionName,
  worker,
}: ExtensionPointProps) {
  const components = useOverrideComponents<'MainCheckout'>()
  // console.log(components)
  const Component = components[extensionName].Component
  const controller = useMemo(
    () => createController({ [extensionName]: Component }),
    []
  )
  const receiver = useMemo(() => createRemoteReceiver(), [])

  useEffect(() => {
    // worker.render(extensionName, () => <Component {...({} as any)} />)
    // This runs the exported run() function from our worker
    if (worker) {
      console.log(worker)
      worker.run(receiver.receive, extensionName)
    }
  }, [receiver, worker, extensionName, Component])

  return <RemoteRenderer receiver={receiver} controller={controller} />
}
