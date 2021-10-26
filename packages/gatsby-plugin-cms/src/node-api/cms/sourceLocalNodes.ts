import { join } from 'path'

import globby from 'globby'
import { readJSON } from 'fs-extra'
import type { ParentSpanPluginArgs } from 'gatsby'

import type { TransformedContent } from './fetchNodes'
import { PLUGIN } from '../../constants'

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

      return { ...json, remoteId: id, id } as TransformedContent
    })
  )

  activity.end()

  return nodes
}
