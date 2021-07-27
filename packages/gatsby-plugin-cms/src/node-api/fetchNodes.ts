import type { ParentSpanPluginArgs } from 'gatsby'
import {
  compileNodeQueries,
  createDefaultQueryExecutor,
  generateDefaultFragments,
  loadSchema,
} from 'gatsby-graphql-source-toolkit'
import { print } from 'graphql'

import { PLUGIN } from '../constants'
import type { Options } from '../gatsby-node'
import type { RemotePageContent } from './types'

export const fetchAllNodes = async (
  gatsbyApi: ParentSpanPluginArgs,
  options: Options
): Promise<RemotePageContent[]> => {
  const activity1 = gatsbyApi.reporter.activityTimer(
    `[${PLUGIN}]: Fetching CMS schema and creating queries`
  )

  activity1.start()

  const { tenant, workspace } = options

  // Step1. Set up remote schema:
  const executor = createDefaultQueryExecutor(
    `https://${workspace}--${tenant}.myvtex.com/graphql`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    }
  )

  const schema = await loadSchema(executor)

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `PageContent`,
      queries: `
        query LIST_PAGES ($first: Int!, $after: String ) {
          vtex {
            pages (first: $first, after: $after, builderId: "faststore") {
              pageInfo {
                hasNextPage
              }
              edges {
                cursor
                node {
                  ...PageContentFragment
                }
              }
            }
          }
        }
        fragment PageContentFragment on PageContent { __typename id }
      `,
    },
  ]

  // Step3. Generate fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes })

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  const pageContentQuery = documents.get(gatsbyNodeTypes[0].remoteTypeName)!

  activity1.end()

  // Step5. Fetch all remote nodes
  let hasNextPage = true
  let data: RemotePageContent[] = []
  let after: string | undefined

  const activity2 = gatsbyApi.reporter.activityTimer(
    `[${PLUGIN}]: Fetching PageContents`
  )

  activity2.start()

  while (hasNextPage === true) {
    hasNextPage = false

    const response = await executor({
      query: print(pageContentQuery),
      document: pageContentQuery,
      variables: { first: 90, after },
      operationName: 'LIST_PAGES',
    })

    const pages = response.data?.vtex.pages

    if (pages) {
      const { edges, pageInfo } = pages
      const nodes = edges.map((x: any) => x.node)

      after = edges[edges.length - 1].cursor
      hasNextPage = pageInfo.hasNextPage
      data = [...data, ...nodes]
    }
  }

  activity2.end()

  return data
}
