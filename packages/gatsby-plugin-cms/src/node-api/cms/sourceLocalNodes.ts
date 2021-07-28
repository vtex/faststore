import { join } from 'path'

import globby from 'globby'
import { readJSON } from 'fs-extra'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../../constants'
import type { RemotePageContent } from './types'

const localNodeKey = (path: string) => `${PLUGIN}:fixture:${path}`

/**
 * @description Fetch Nodes from fixtures folder
 */
export const fetchAllNodes = async (gatsbyApi: ParentSpanPluginArgs) => {
  const activity = gatsbyApi.reporter.activityTimer(
    `[${PLUGIN}]: fetching PageContents from fixtures`
  )

  activity.start()

  const root = join(process.cwd(), 'src', PLUGIN, 'fixtures')

  const files = await globby('*.json', { cwd: root, deep: 1, onlyFiles: true })

  const nodes = await Promise.all(
    files.map(async (file) => {
      const json = await readJSON(join(root, file))
      const id = localNodeKey(file)

      return { ...json, remoteId: id, id } as RemotePageContent
    })
  )

  activity.end()

  return nodes
}
