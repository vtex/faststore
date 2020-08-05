/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/naming-convention */
import assert from 'assert'
import { createHash } from 'crypto'

import {
  FragmentDefinitionNode,
  OperationDefinitionNode,
  parse,
  print,
  visit,
} from 'graphql'

export interface CompiledQuery {
  operationName: string
  sha256Hash: string
  filename: string
  value: string
}

export interface Node {
  filename: string
  value: string
}

function hash(s: string) {
  return createHash('sha256').update(s, 'utf8').digest().toString('hex')
}

function isOperationDefinition(ob: any): ob is OperationDefinitionNode {
  return Boolean(ob && ob.kind === 'OperationDefinition')
}

function isFragmentDefinition(ob: any): ob is FragmentDefinitionNode {
  return Boolean(ob && ob.kind === 'FragmentDefinition')
}

/**
 * In memory presentation of GraphQL queries that appear in the code
 */
export class QueryManager {
  /**
   * Queries by name
   */
  public queries = new Map<string, Node | undefined>()

  /**
   * Fragments by name
   */
  public fragments = new Map<string, Node | undefined>()

  /**
   * Fragments by query name
   */
  public fragmentsUsedByQuery = new Map<string, Set<string> | undefined>()

  /**
   * Fragments by fragment name
   */
  public fragmentsUsedByFragment = new Map<string, Set<string> | undefined>()

  public static getSingleton(): QueryManager {
    if (!(global as any).QueryManager) {
      ;(global as any).QueryManager = new QueryManager()
    }

    return (global as any).QueryManager
  }

  public addQuery({
    query: queryStr,
    filename,
  }: {
    query: string
    filename: string
  }) {
    const doc = parse(queryStr)

    visit(doc, {
      OperationDefinition: (def) => {
        if (!def.name) {
          throw new Error('OperationDefinition missing name')
        }

        const queryName = def.name.value

        assert(
          queryName.endsWith('Query') || queryName.endsWith('Mutation'),
          'GraphQL OperationName should endsWith Query or Mutation'
        )

        const query = print(def).trim()

        this.queries.set(queryName, { value: query, filename })
        this.fragmentsUsedByQuery.set(queryName, new Set())
      },
      FragmentDefinition: (def) => {
        const fragmentName = def.name.value
        const fragment = print(def).trim()

        assert(
          fragmentName.split('_').length === 2,
          'GraphQL Fragment should be named following the template <ComponentName>_<PropName>'
        )

        if (this.fragments.get(fragmentName)?.value === fragment) {
          // no changes
          return
        }

        this.fragments.set(fragmentName, { value: fragment, filename })
        this.fragmentsUsedByFragment.set(fragmentName, new Set())
      },
      FragmentSpread: (node, key, parent, path, ancestors) => {
        const fragmentSpreadName = node.name.value

        for (const a of ancestors) {
          if (isFragmentDefinition(a)) {
            const parentFragmentName = a.name.value

            let fragments = this.fragmentsUsedByFragment.get(parentFragmentName)

            if (!fragments) {
              fragments = new Set()
              this.fragmentsUsedByFragment.set(parentFragmentName, fragments)
            }

            fragments.add(fragmentSpreadName)
          }

          if (isOperationDefinition(a)) {
            const queryName = a.name?.value

            if (!queryName) {
              continue
            }

            let fragments = this.fragmentsUsedByQuery.get(queryName)

            if (!fragments) {
              fragments = new Set()
              this.fragmentsUsedByQuery.set(queryName, fragments)
            }

            fragments.add(fragmentSpreadName)
          }
        }
      },
    })
  }

  public ensureRequiredFragments(queryName: string) {
    const usedFragments = this.getUsedFragmentNamesForQuery(queryName)

    for (const fragmentName of usedFragments) {
      if (!this.fragments.has(fragmentName)) {
        throw new Error(
          `Could not find fragment ${fragmentName} for query ${queryName}`
        )
      }
    }

    return true
  }

  public getQueries() {
    const operationNames = Array.from(this.queries.keys())

    return operationNames.map((operationName) => {
      this.ensureRequiredFragments(operationName)

      return this.exportQuery(operationName)
    })
  }

  public getFragments() {
    return Array.from(this.fragments.values()).reduce((acc, fragment) => {
      if (fragment) {
        return acc.concat(fragment)
      }

      return acc
    }, [] as Node[])
  }

  public getUsedFragmentNamesForQuery(queryName: string) {
    const fragmentNames = new Set<string>()
    const usedFragments = this.fragmentsUsedByQuery.get(queryName)

    if (!usedFragments) {
      return fragmentNames
    }

    for (const usedFragmentName of usedFragments) {
      fragmentNames.add(usedFragmentName)
      this.getNestedFragmentNamesForFragment(usedFragmentName, fragmentNames)
    }

    return fragmentNames
  }

  public getNestedFragmentNamesForFragment(
    fragmentName: string,
    _fragments?: Set<string>
  ) {
    const fragments = _fragments ?? new Set()
    const usedFragments = this.fragmentsUsedByFragment.get(fragmentName)

    if (usedFragments) {
      for (const usedFragmentName of usedFragments) {
        fragments.add(usedFragmentName)
        this.getNestedFragmentNamesForFragment(usedFragmentName, fragments)
      }
    }

    return fragments
  }

  public exportQuery(operationName: string): CompiledQuery {
    const queryNode = this.queries.get(operationName)

    if (!queryNode) {
      throw new Error(`Unknown query ${operationName}`)
    }

    const { value, filename } = queryNode
    const fragments = Array.from(
      this.getUsedFragmentNamesForQuery(operationName)
    )
      .map((f) => this.fragments.get(f)?.value)
      .join('\n')

    const fullQuery = `${value}\n${fragments}`.trim()

    return {
      filename,
      sha256Hash: hash(fullQuery),
      value: fullQuery,
      operationName,
    }
  }
}
