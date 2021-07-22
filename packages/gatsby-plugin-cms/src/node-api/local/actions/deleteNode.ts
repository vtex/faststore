import { basename } from 'path'

import { deleteNodes } from 'gatsby-graphql-source-toolkit'
import type {
  INodeDeleteEvent,
  ISourcingContext,
} from 'gatsby-graphql-source-toolkit/dist/types'

import { remoteId } from '../remoteId'

export const deleteNode = async (context: ISourcingContext, path: string) => {
  if (!path.endsWith('.json')) {
    return
  }

  context.gatsbyApi.reporter.info(
    `[gatsby-plugin-cms]: Deleting fixture from: ${basename(path)}`
  )

  const event: INodeDeleteEvent = {
    eventName: 'DELETE',
    remoteTypeName: 'PageContent',
    remoteId: { id: remoteId(path) },
  }

  deleteNodes(context, [event])
}
