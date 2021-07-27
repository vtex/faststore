import { join } from 'path'

import chokidar from 'chokidar'
import { readJSON } from 'fs-extra'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../constants'
import { createSchemaCustomization, deleteNode, sourceNode } from './sourceNode'
import type { RemotePageContent } from './types'

const localNodeKey = (path: string) => `${PLUGIN}:fiture:${path}`

const sourceLocalNode = async (
  gatsbyApi: ParentSpanPluginArgs,
  path: string
) => {
  if (!path.endsWith('.json')) {
    return
  }

  const node: RemotePageContent = await readJSON(path)

  // TODO: We should add a verification if the json complies with the exported JSON schema
  if (!node || Object.keys(node).length === 0) {
    return
  }

  node.remoteId = node.remoteId ?? path

  await gatsbyApi.cache.set(localNodeKey(path), node)

  // Must create schema customization before sourcing nodes
  createSchemaCustomization(gatsbyApi, [node])

  sourceNode(gatsbyApi, node)
}

const deleteLocalNode = async (
  gatsbyApi: ParentSpanPluginArgs,
  path: string
) => {
  if (!path.endsWith('.json')) {
    return
  }

  const localNode = await gatsbyApi.cache.get(localNodeKey(path))

  deleteNode(gatsbyApi, localNode)
}

/** Source Nodes from fixtures folder */
export const sourceAllLocalNodes = async (
  gatsbyApi: ParentSpanPluginArgs,
  root: string,
  name: string
) => {
  const watcher = chokidar.watch(join(root, 'src', name, 'fixtures'), {
    ignoreInitial: false,
    depth: 1,
  })

  watcher.on('add', (path) => sourceLocalNode(gatsbyApi, path))
  watcher.on('change', (path) => sourceLocalNode(gatsbyApi, path))
  watcher.on('unlink', (path) => deleteLocalNode(gatsbyApi, path))

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
