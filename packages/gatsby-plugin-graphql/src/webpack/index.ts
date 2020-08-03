import { promises as fs } from 'fs'
import PathUtils from 'path'

import { debug } from '../debug'
import { BABEL_GQL_GLOBAL, QueryManager } from '../manager'

interface OnDone {
  (qm: QueryManager, modifiedQueryCount: number): Promise<any>
}

export class BabelGQLWebpackPlugin {
  protected target: string
  protected onDone?: OnDone
  protected active?: boolean

  constructor(options: { target: string; onDone?: OnDone; active?: boolean }) {
    debug('Initializing Webpack plugin')
    if (!options.target) {
      throw new Error('No target passed to QueryManagerWebpackPlugin')
    }

    this.target = options.target
    this.onDone = options.onDone

    if (typeof this.active === 'undefined') {
      this.active = true
    } else {
      this.active = options.active
    }
  }

  public apply(compiler: any) {
    BABEL_GQL_GLOBAL.babelGQLWebpackPlugin = true

    compiler.hooks.done.tapPromise('BabelGQLWebpackPlugin', async () => {
      await this.handleDone().catch((error) => {
        console.error('[babel-gql] Webpack plugin failed', error)
      })
    })
  }

  public async handleDone() {
    if (!QueryManager.hasRegisterdGlobal()) {
      return
    }

    const qm = QueryManager.getRegisteredGlobal()

    await fs.mkdir(this.target, { recursive: true })

    const allQueries = qm.getQueries()

    const dirtyQueries = qm.popDirtyQueries()

    debug(`Found ${dirtyQueries.length}/${allQueries.length} dirty queries`)

    if (dirtyQueries.length === 0) {
      return
    }

    if (this.active) {
      await Promise.all(
        dirtyQueries.map(async (query) => {
          const path = PathUtils.join(
            this.target,
            `${query.queryName}-${query.fullQueryId}.graphql`
          )

          console.log('[babel-gql] Writing ', path)
          await fs.writeFile(path, query.fullQuery)
        })
      )
    }

    if (this.onDone) {
      await this.onDone(qm, dirtyQueries.length)
    }
  }
}
