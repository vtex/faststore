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
      variables: {
        first: Math.min(DEFAULT_PAGE_SIZE, maxItems),
        after: undefined,
      },
      hasNextPage: true,
    }
  },
  next(state, page) {
    const { first: rawFirst, after: maybeStateAfter } = state.variables

    const stateAfter = Number.isNaN(Number(maybeStateAfter))
      ? 0
      : Number(maybeStateAfter)

    const first = Number(rawFirst) ?? DEFAULT_PAGE_SIZE
    const after = (stateAfter + first).toString()

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
