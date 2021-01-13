import { basename } from 'path'

import { readJSON } from 'fs-extra'
import type { ISourcingContext } from 'gatsby-graphql-source-toolkit/dist/types'
import { createNodes } from 'gatsby-graphql-source-toolkit'

import { remoteId } from '../remoteId'

export const createNode = async (
  context: ISourcingContext,
  path: string,
  update = false
) => {
  if (!path.endsWith('.json')) {
    return
  }

  const json = await readJSON(path)

  // TODO: We should add a verification if the json complies with the exported JSON schema
  if (!json || Object.keys(json).length === 0) {
    return
  }

  json.remoteId = remoteId(path)
  json.remoteTypeName = 'PageContent'

  context.gatsbyApi.reporter.info(
    `[gatsby-plugin-cms]: ${
      update ? 'Updating' : 'Creating'
    } fixture from: ${basename(path)}`
  )

  createNodes(context, json.remoteTypeName, [json] as any)
}
