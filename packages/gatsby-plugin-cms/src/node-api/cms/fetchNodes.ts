import type { ParentSpanPluginArgs } from 'gatsby'

import { fetch, fetchAPI } from '../../utils/fetch'
import { PLUGIN } from '../../constants'
import type { Options } from '../../gatsby-node'
import type {
  RelayPagination,
  RemotePageContent,
  RemoteRESTPageContent,
} from './types'

interface Query {
  vtex: {
    contents: RelayPagination<RemotePageContent>
  }
}

const getApiUrl = ({ tenant, workspace }: Options) =>
  `https://${workspace}--${tenant}.myvtex.com/_v/cms/api/faststore`

const LIST_PAGES_QUERY = `
query LIST_PAGES ($first: Int!, $after: String, $orderBy: VTEX_ContentsOrderInput, $filters: VTEX_ContentsFiltersInput) {
  vtex {
    contents (first: $first, after: $after, orderBy: $orderBy, filters: $filters) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...ContentFragment
        }
      }
    }
  }
}
fragment ContentFragment on VTEX_Content {
  __typename
  remoteId: id
  id
  name
  contentType {
    id
  }
  variants {
    edges {
      node {
        status
      	sections {
          props: data
          name
        }
        configurationDataSets {
          name
          configurations {
            name
            props: data
          }
        }
      }
    }
  }
}
`

const ordering = {
  draft: 0,
  live: 1,
  publishing: 2,
  unpublishing: 3,
}

const getRemoteVariant = (node: RemotePageContent, preview = false) => {
  const { variants, ...rest } = node
  const allowedStatus = new Set([
    'live',
    'publishing',
    ...(preview ? ['draft'] : []),
  ])

  const edge = variants.edges
    .sort((e1, e2) => ordering[e1.node.status] - ordering[e2.node.status])
    .find((x) => allowedStatus.has(x.node.status))

  return edge
    ? {
        ...rest,
        variant: edge.node,
      }
    : undefined
}

export type TransformedContent = NonNullable<
  ReturnType<typeof getRemoteVariant>
>

export const fetchAllNodes = async (
  gatsbyApi: ParentSpanPluginArgs,
  options: Options
): Promise<TransformedContent[]> => {
  const { tenant, workspace, preview } = options

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
  let data: TransformedContent[] = []
  let after: string | undefined

  while (hasNextPage === true) {
    hasNextPage = false

    const response = await executor<Query>({
      query: LIST_PAGES_QUERY,
      variables: {
        first: 50,
        after,
        orderBy: { field: 'UPDATED_AT', direction: 'DESC' },
        filters: {
          builderId: {
            value: 'faststore',
          },
          status: {
            draft: true,
            published: true,
            publishing: true,
          },
        },
      },
      operationName: 'LIST_PAGES',
    })

    if (Array.isArray(response.errors)) {
      for (const error of response.errors) {
        console.error(error)
      }

      throw new Error('Something went wrong while fetching data from the CMS')
    }

    const contents = response.data?.vtex.contents

    if (contents) {
      const { edges, pageInfo } = contents
      const nodes = edges
        .map((x) => getRemoteVariant(x.node, preview))
        .filter((x): x is TransformedContent => Boolean(x))

      after = edges[edges.length - 1]?.cursor
      hasNextPage = pageInfo.hasNextPage
      data = [...data, ...nodes]
    }
  }

  activity.end()

  return data
}

type ReleaseLocator = {
  id: string
  contentType: string
  releaseId: string
}

type DraftLocator = {
  id: string
  contentType: string
  versionId: string
}

const isReleaseLocator = (x: NodeLocator): x is ReleaseLocator =>
  typeof (x as any).releaseId === 'string'

const isDraftLocator = (x: NodeLocator): x is DraftLocator =>
  typeof (x as any).versionId === 'string'

export type NodeLocator = ReleaseLocator | DraftLocator

// Fetch the node on the REST API and transform it to the plugin
export const fetchNodeById = async (
  gatsbyApi: ParentSpanPluginArgs,
  options: Options,
  locator: NodeLocator
) => {
  const url = getApiUrl(options)

  const activity = gatsbyApi.reporter.activityTimer(
    `[${PLUGIN}]: fetching Node from remote`
  )

  activity.start()

  const { id, contentType } = locator

  const params = new URLSearchParams()

  if (isReleaseLocator(locator)) {
    params.set('releaseId', locator.releaseId)
  }

  if (isDraftLocator(locator)) {
    params.set('versionId', locator.versionId)
  }

  const response = await fetchAPI<RemoteRESTPageContent>(
    `${url}/${contentType}/${id}?${params.toString()}`
  )

  activity.end()

  return response
}
