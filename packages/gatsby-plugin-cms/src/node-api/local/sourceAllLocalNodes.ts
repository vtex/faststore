import { join } from 'path'

import chokidar from 'chokidar'
import { createSourcingContext } from 'gatsby-graphql-source-toolkit'
import type { ISourcingConfig } from 'gatsby-graphql-source-toolkit/dist/types'

import { createNode } from './actions/createNode'
import { deleteNode } from './actions/deleteNode'

/** Source Nodes from fixtures folder */
export const sourceAllLocalNodes = async (
  config: ISourcingConfig,
  root: string,
  name: string
) => {
  const context = createSourcingContext(config)

  const watcher = chokidar.watch(join(root, 'src', name, 'fixtures'), {
    ignoreInitial: false,
    depth: 1,
  })

  watcher.on('add', (path) => createNode(context, path))
  watcher.on('change', (path) => createNode(context, path, true))
  watcher.on('unlink', (path) => deleteNode(context, path))

  // Wait for chokidar ready event.
  //
  // If we don't wait for this event, gatsby will think this plugin didn't source any
  // node and will ask to the developer to remove it. Since we are `ignoreInitial: false`
  // we are sure chokidar will fire the ready event and not stall the build process
  const onReady = new Promise((resolve) => {
    watcher.on('ready', resolve)
  })

  await onReady

  // Do not keep the watcher in `gatsby build`
  if (process.env.NODE_ENV === 'production') {
    watcher.close()
  }
}
