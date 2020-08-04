import { join } from 'path'

import { optimizeDocuments } from '@graphql-tools/relay-operation-optimizer'
import { mkdirSync, writeFile } from 'fs-extra'
import { GraphQLSchema, parse, print } from 'graphql'

import { QueryInfo } from '.'
import { debug, error } from './console'
import { QueryManager } from './manager'
import { Storage } from './storage'

export const persisted = 'persisted.graphql.json'
export const queryInfo = 'queryInfo.graphql.json'

export const publicPath = '/page-data/_graphql'

export const target = join(process.cwd(), 'public', publicPath)

export class WebpackPlugin {
  public persistedStorage: Storage
  public queryInfoStorage: Storage<QueryInfo>

  constructor(public schema: GraphQLSchema) {
    debug('Initializing Webpack plugin')

    this.persistedStorage = new Storage(join(target, persisted))
    this.queryInfoStorage = new Storage(join(target, queryInfo))
    this.persistedStorage.clear()
    this.queryInfoStorage.clear()

    mkdirSync(target, { recursive: true })
  }

  public optimizeQuery = (query: string) => {
    const document = parse(query)

    const optimized = optimizeDocuments(this.schema, [document], {
      includeFragments: true,
    })

    return print(optimized[0])
  }

  public apply(compiler: any) {
    compiler.hooks.done.tapPromise('gatsby-plugin-graphql', async () => {
      try {
        const qm = QueryManager.getSingleton()
        const allQueries = qm.getQueries()

        debug(`Found ${allQueries.length} queries`)

        if (allQueries.length === 0) {
          return
        }

        debug(`Optimizing queries`)

        await Promise.all(
          allQueries.map(async ({ operationName, sha256Hash, query }) => {
            const path = join(target, `${operationName}-${sha256Hash}.graphql`)
            const optimized = this.optimizeQuery(query)

            this.persistedStorage.set(sha256Hash, optimized)
            this.queryInfoStorage.set(operationName, {
              query: optimized,
              sha256Hash,
            })

            debug(`Writing: ${path}`)

            return writeFile(path, operationName)
          })
        )
      } catch (err) {
        error('Webpack plugin failed', err)
      }
    })
  }
}
