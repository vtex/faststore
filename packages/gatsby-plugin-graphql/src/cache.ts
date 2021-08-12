import type { QueryManager } from './manager'

export const serialize = (manager: QueryManager): string => {
  const state = {
    queries: manager.queries,
    fragments: manager.fragments,
    fragmentsUsedByQuery: manager.fragmentsUsedByQuery,
    fragmentsUsedByFragment: manager.fragmentsUsedByFragment,
  }

  return JSON.stringify(state, (_, value) => {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      }
    }

    if (value instanceof Set) {
      return {
        dataType: 'Set',
        value: Array.from(value.keys()),
      }
    }

    return value
  })
}

export const hydrate = (
  serialized: string,
  manager: QueryManager
): QueryManager => {
  const state = JSON.parse(serialized, (_, value) => {
    if (typeof value === 'object' && value != null) {
      if (value.dataType === 'Map') {
        return new Map(value.value)
      }

      if (value.dataType === 'Set') {
        return new Set(value.value)
      }
    }

    return value
  })

  manager.queries = state.queries
  manager.fragments = state.fragments
  manager.fragmentsUsedByQuery = state.fragmentsUsedByQuery
  manager.fragmentsUsedByFragment = state.fragmentsUsedByFragment

  return manager
}
