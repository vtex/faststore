import { readdir } from 'fs/promises'
import { basename, join } from 'path'

import { BabelGQLWebpackPlugin } from 'babel-gql/plugin'
import { readFile } from 'fs-extra'
import {
  CreateBabelConfigArgs,
  CreateWebpackConfigArgs,
  ParentSpanPluginArgs,
} from 'gatsby'
import { parse, print } from 'graphql'

import { Storage } from './storage'

const root = process.cwd()
const storage = new Storage(join(root, 'public/persisted.graphql.json'))
const babelGQLFolderPath = join(root, '.cache/queries')

const getIsolatedQuery = (query: string, fieldName: string) => {
  const document = parse(query)

  for (const definition of document.definitions) {
    const updatedRoot = (definition as any).selectionSet.selections.find(
      (selection: any) =>
        selection.name &&
        selection.name.kind === 'Name' &&
        selection.name.value === fieldName
    )

    if (!updatedRoot) {
      continue
    }

    ;(definition as any).selectionSet.selections =
      updatedRoot.selectionSet.selections
  }

  return print(document)
}

export const onPreBootstrap = () => {
  storage.clear()
}

export const onPreExtractQueries = ({ store }: ParentSpanPluginArgs) => {
  store.subscribe(async () => {
    const {
      lastAction: { type, payload },
      components,
      pages: allPages,
    } = store.getState()

    if (type !== 'QUERY_EXTRACTED') {
      return
    }

    const { componentPath, query } = payload
    const { pages } = components.get(componentPath)

    if (!query) {
      return
    }

    const processedQuery = getIsolatedQuery(query, 'vtex')

    if (!processedQuery) {
      console.log('dropping: ', { query })

      return
    }

    storage.add(query)

    pages.forEach((pagePath: string) => {
      const page = allPages.get(pagePath)

      page.context = { ...page.context, pageQuery: processedQuery }
    })
  })
}

export const onCreateBabelConfig = ({
  actions: { setBabelPlugin },
}: CreateBabelConfigArgs) => {
  setBabelPlugin({
    name: require.resolve('babel-gql/plugin'),
    options: {},
  })
}

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
}: CreateWebpackConfigArgs) => {
  // Clean global variables, otherwise 'babel-gql' complains
  if ((global as any)?.babelGQLQueryManager) {
    delete (global as any).babelGQLQueryManager
  }

  setWebpackConfig({
    plugins: [
      new BabelGQLWebpackPlugin({
        // the directory where persisted query files will be written to
        target: babelGQLFolderPath,
      }),
    ],
  })
}

export const onPostBuild = async () => {
  const entries = await readdir(babelGQLFolderPath)

  await Promise.all(
    entries.map(async (entry) => {
      const filename = basename(entry, '.graphql')
      const [, hash] = filename.split('-')

      const content = await readFile(join(babelGQLFolderPath, entry), {
        encoding: 'utf-8',
      })

      storage.set(hash, content)
    })
  )
}
