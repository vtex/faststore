import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'

const DEFAULT_PAGE_SIZE = 99

export interface IRelayPage {
  edges: Array<{ cursor: string; node: unknown | null }>
  pageInfo: { hasNextPage: boolean }
}

export const RelayForward = (
  maxItems: number
): IPaginationAdapter<IRelayPage, unknown> => ({
  name: 'RelayForward',
  expectedVariableNames: [`first`, `after`],
  start() {
    return {
      variables: { first: DEFAULT_PAGE_SIZE, after: undefined },
      hasNextPage: true,
    }
  },
  next(state, page) {
    const tail = page.edges[page.edges.length - 1]
    const first = Number(state.variables.first) ?? DEFAULT_PAGE_SIZE
    const after = tail?.cursor

    return {
      variables: { first, after },
      hasNextPage: Boolean(
        page?.pageInfo?.hasNextPage && Number(after) < maxItems
      ),
    }
  },
  concat(acc, page) {
    return {
      ...acc,
      edges: {
        ...acc.edges,
        ...page.edges,
      },
      pageInfo: page.pageInfo,
    }
  },
  getItems(pageOrResult) {
    return pageOrResult.edges.map((edge) => (edge ? edge.node : null))
  },
})
