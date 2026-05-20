import { saveFile } from '../utils/file'
import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { getBasePath, withBasePath } from '../utils/directory'
import { logger } from '../utils/logger'
import graphql from 'graphql'
import path from 'path'
import fsExtra from 'fs-extra'
import { pathToFileURL } from 'url'

const { Kind, OperationTypeNode, parse: parseGraphql } = graphql

const persistedDocumentsName = 'persisted-documents.json'
const configFileName = 'discovery.config.default.js'
const cachedOperationsFileName = 'cached-operations.json'

export default class CacheGraphql extends Command {
  static flags = {
    queries: Flags.string({
      name: 'queries',
      description: 'The path to locate persisted-document file.',
    }),
    config: Flags.string({
      name: 'config',
      description: 'The path where the discovery.config is located',
    }),
  }

  static args = {
    store: Args.string({
      name: 'store',
      description:
        'The path where the FastStore being built is or the persisted-document path. Defaults to cwd.',
    }),
  }

  async run() {
    const { args, flags } = await this.parse(CacheGraphql)

    const rootPath = getBasePath()
    const argPath =
      (args?.store && path.resolve(rootPath, args.store)) || rootPath
    const { tmpDir } = withBasePath(argPath)
    const configPath =
      this.getConfigFile(flags.config && path.resolve(argPath, flags.config)) ||
      this.getConfigFile(tmpDir) ||
      this.getConfigFile(argPath)
    const persistedDocumentsPath =
      this.getPersistedDocument(
        (flags?.queries && path.resolve(argPath, flags?.queries)) || argPath
      ) || this.getPersistedDocument(tmpDir)
    if (!configPath) {
      return this.errorFileNotFound(
        configFileName,
        `\n    ${tmpDir}\n    ${argPath}`
      )
    }

    if (!persistedDocumentsPath) {
      return this.errorFileNotFound(
        persistedDocumentsName,
        flags?.queries ?? argPath
      )
    }

    const cachedOperationsPath = path.join(
      path.dirname(persistedDocumentsPath),
      cachedOperationsFileName
    )
    const saveCachedOperationsFile = saveFile(cachedOperationsPath)

    if (fsExtra.pathExistsSync(tmpDir))
      logger.info(`${chalk.blue('[Info]')} - .faststore Path at: ${tmpDir}`)

    logger.info(`${chalk.blue('[Info]')} - Config file location: ${configPath}`)
    logger.info(
      `${chalk.blue('[Info]')} - Persisted documents at: ${persistedDocumentsPath}`
    )
    logger.info(
      `${chalk.blue('[Info]')} - Cached operations output: ${cachedOperationsPath}`
    )

    const { default: persistedDocuments } = await import(
      pathToFileURL(persistedDocumentsPath).href,
      { with: { type: 'json' } }
    )

    const cachedQueries = getQueries(persistedDocuments)

    saveCachedOperationsFile(
      `${JSON.stringify(cachedQueries ?? [], null, 2)}\n`
    )

    logger.info(
      `${chalk.green('[Success]')} - GraphQL queries cached with success: 🎉
      Queries: ${cachedQueries.join(', ')}`
    )
  }

  getPersistedDocument(rootPath?: string) {
    return this.getFile(persistedDocumentsName, [
      '@generated',
      persistedDocumentsName,
    ])(rootPath)
  }

  getConfigFile(rootPath?: string) {
    return this.getFile(configFileName, [configFileName])(rootPath)
  }

  getFile(fileName: string, pathFromRoot?: string | Array<string>) {
    return (rootPath?: string) => {
      switch (true) {
        case !rootPath:
          return
        case rootPath?.endsWith(fileName) && fsExtra.existsSync(rootPath):
          return rootPath
        case fsExtra.existsSync(path.join(rootPath ?? '', fileName)):
          return path.join(rootPath, fileName)
        default:
          if (!pathFromRoot) return

          const filePath = path.join(
            rootPath,
            ...(Array.isArray(pathFromRoot) ? pathFromRoot : [pathFromRoot])
          )

          if (fsExtra.existsSync(filePath)) {
            return filePath
          }
          return
      }
    }
  }

  errorFileNotFound(fileName: string, rootDir: string) {
    logger.error(
      `${chalk.red('[Error]')} - Couldn't find ${fileName} at ${rootDir}`
    )

    process.exit(1)
  }
}

const getQueries = (persistedDocuments: Record<string, string>) => {
  const operationNames: Array<string> = []
  for (const operation of Object.values(persistedDocuments)) {
    let currentNames: Array<string> = []
    const operationAST = parseGraphql(operation)
    const hasMutationDefinition = operationAST.definitions.some(
      (def) =>
        def.kind === Kind.OPERATION_DEFINITION &&
        def.operation === OperationTypeNode.MUTATION
    )

    if (hasMutationDefinition) continue

    operationAST.definitions.forEach((definition) => {
      if (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.QUERY &&
        definition.name?.kind === Kind.NAME &&
        !!definition.name?.value
      ) {
        currentNames.push(definition.name.value)
        return
      }
    })

    if (currentNames.length) {
      operationNames.push(...currentNames)
      currentNames = []
    }
  }

  return operationNames
}
