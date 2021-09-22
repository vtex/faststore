import type { ParentSpanPluginArgs } from 'gatsby'

import fetch from '../../utils/fetch'
import { PLUGIN } from '../../constants'
import type { Options } from '../../gatsby-node'
import type { RemotePageContent } from './types'

const LIST_PAGES_QUERY = `
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
fragment PageContentFragment on PageContent {
  __typename
  id
  remoteId: id
  name
  type
  builderId
  lastUpdatedAt
  author {
    id
    email
  }
  blocks {
    name
    props
  }
  extraBlocks {
    name
    blocks {
      name
      props
    }
  }
}
`

export const fetchAllNodes = async (
  gatsbyApi: ParentSpanPluginArgs,
  options: Options
): Promise<RemotePageContent[]> => {
  const { tenant, workspace } = options

  const activity = gatsbyApi.reporter.activityTimer(
    `[${PLUGIN}]: fetching PageContents from remote`
  )

  activity.start()

  const executor = <T = any>({
    query,
    variables,
    operationName,
  }: {
    query: string
    variables: any
    operationName: string
  }) =>
    fetch(`https://${workspace}--${tenant}.myvtex.com/graphql`, {
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    }).then((x) => x.json()) as Promise<{ data: T | null; errors: any[] }>

  let hasNextPage = true
  let data: RemotePageContent[] = []
  let after: string | undefined

  while (hasNextPage === true) {
    hasNextPage = false

    const response = await executor({
      query: LIST_PAGES_QUERY,
      variables: { first: 90, after },
      operationName: 'LIST_PAGES',
    })

    const pages = response.data?.vtex.pages

    if (pages) {
      const { edges, pageInfo } = pages
      const nodes = edges.map((x: any) => x.node)

      after = edges[edges.length - 1]?.cursor
      hasNextPage = pageInfo.hasNextPage
      data = [...data, ...nodes]
    }
  }

  activity.end()

  return data
}
