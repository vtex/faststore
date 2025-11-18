import { saveFile } from '../utils/file'
import { format } from 'prettier'
import { Args, Command } from '@oclif/core'
import chalk from 'chalk'
import { getBasePath, withBasePath } from '../utils/directory'
import { logger } from '../utils/logger'
import { Kind, OperationTypeNode, parse as parseGraphql } from 'graphql'
import path from 'path'
import fsExtra from 'fs-extra'

export default class CacheGraphql extends Command {
  static flags = {}

  static args = {
    path: Args.string({
      name: 'path',
      description:
        'The path where the FastStore being built is. Defaults to cwd.',
    }),
  }

  async run() {
    const { args } = await this.parse(CacheGraphql)
    const basePath = getBasePath(args.path)
    const { tmpDir } = withBasePath(basePath)
    const configFileName = 'discovery.config.default.js'
    const configPath = path.join(tmpDir, configFileName)
    const saveConfigFile = saveFile(configPath)

    logger.info(`${chalk.blue('[Info]')} - .faststore Path at: ${tmpDir}`)

    const persistedDocumentsPath = path.join(
      tmpDir,
      '@generated',
      'persisted-documents.json'
    )

    const { default: persistedDocuments } = await import(
      persistedDocumentsPath,
      { with: { type: 'json' } }
    )

    if (!!persistedDocuments) {
      logger.info(
        `${chalk.blue('[Info]')} - Found graphql persisted documents at: ${persistedDocumentsPath}`
      )
    }

    if (fsExtra.existsSync(configPath) === false) {
      logger.error(
        `${chalk.red('[Error]')} - Couldn't find ${configFileName} as ${tmpDir}`
      )
    }

    const discoveryConfig = await import(configPath)

    const cachedQueries = getQueries(persistedDocuments)

    saveConfigFile(
      await format(
        `module.exports = ${JSON.stringify(
          {
            ...(discoveryConfig?.default ?? discoveryConfig),
            experimental: {
              ...(discoveryConfig?.default ?? discoveryConfig).experimental,
              cachedOperations: cachedQueries ?? [],
            },
          },
          undefined,
          2
        )}`,
        {
          parser: 'typescript',
          quoteProps: 'as-needed',
        }
      )
    )

    logger.log(
      `${chalk.green('success')} - GraphQL queries cached with success: 🎉
      Queries: ${cachedQueries.join(', ')}`
    )
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
        return true
      }

      return false
    })

    if (currentNames.length) {
      operationNames.push(...currentNames)
      currentNames = []
    }
  }

  return operationNames
}
