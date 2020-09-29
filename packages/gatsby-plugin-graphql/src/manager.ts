/* eslint-disable max-params */
import assert from 'assert'
import { createHash } from 'crypto'

import {
  FragmentDefinitionNode,
  OperationDefinitionNode,
  parse,
  print,
  visit,
} from 'graphql'

export interface CompiledQuery extends Node {
  sha256Hash: string
}

export interface Node {
  filename: string
  value: string
  name: string
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

const isThirdPartyScript = (filename: string) =>
  filename.includes('node_modules')

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
          // We allow third party queries not to be named. This is ok
          // since we don't support using them
          if (isThirdPartyScript(filename)) {
            return
          }

          throw new Error('OperationDefinition missing name')
        }

        const queryName = def.name.value

        assert(
          queryName.endsWith('Query') || queryName.endsWith('Mutation'),
          'GraphQL OperationName should endsWith Query or Mutation'
        )

        const query = print(def).trim()

        if (this.queries.get(queryName) !== undefined) {
          console.warn(
            `Skipping query ${queryName} since it was already defined. If this wasn't the intended behavior please change your query operation name`
          )

          return
        }

        this.queries.set(queryName, { value: query, filename, name: queryName })
        this.fragmentsUsedByQuery.set(queryName, new Set())
      },
      FragmentDefinition: (def) => {
        const fragmentName = def.name.value
        const fragment = print(def).trim()

        assert(
          fragmentName.split('_').length === 2,
          'GraphQL Fragment should be named following the template <ComponentName>_<PropName>'
        )

        if (this.fragments.get(fragmentName) !== undefined) {
          console.warn(
            `Skipping query ${fragmentName} since it was already defined. If this wasn't the intended behavior please change your query operation name`
          )

          return
        }

        this.fragments.set(fragmentName, {
          value: fragment,
          filename,
          name: fragmentName,
        })
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
    const fragments = Array.from(this.fragments.keys())

    return fragments.map((fragmentName) => {
      // TODO: Do something like ensureRequiredFragments in here

      return this.exportFragment(fragmentName)
    })
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
      name: operationName,
      sha256Hash: hash(fullQuery),
      value: fullQuery,
      filename,
    }
  }

  public exportFragment(fragmentName: string): Node {
    const fragmentNode = this.fragments.get(fragmentName)

    if (!fragmentNode) {
      throw new Error(`Unknown fragment ${fragmentName}`)
    }

    const { value, filename } = fragmentNode
    const fragments = Array.from(
      this.getNestedFragmentNamesForFragment(fragmentName)
    )
      .map((f) => this.fragments.get(f)?.value)
      .join('\n')

    const resolvedFragment = `${value}\n${fragments}`.trim()

    return {
      name: fragmentName,
      value: resolvedFragment,
      filename,
    }
  }
}
