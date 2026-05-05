import { saveFile } from '../utils/file'
import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { getBasePath, withBasePath } from '../utils/directory'
import { logger } from '../utils/logger'
import graphql from 'graphql'
import path from 'path'
import fsExtra from 'fs-extra'
import prettier from 'prettier'

const { Kind, OperationTypeNode, parse: parseGraphql } = graphql

const persistedDocumentsName = 'persisted-documents.json'
const configFileName = 'discovery.config.default.js'

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

    const saveConfigFile = saveFile(configPath)

    if (fsExtra.pathExistsSync(tmpDir))
      logger.info(`${chalk.blue('[Info]')} - .faststore Path at: ${tmpDir}`)

    logger.info(`${chalk.blue('[Info]')} - Config file location: ${configPath}`)
    logger.info(
      `${chalk.blue('[Info]')} - Persisted documents at: ${persistedDocumentsPath}`
    )

    const { default: persistedDocuments } = await import(
      persistedDocumentsPath,
      { with: { type: 'json' } }
    )

    const cachedQueries = getQueries(persistedDocuments)

    const source = fsExtra.readFileSync(configPath, 'utf8')
    const patched = updateCachedOperations(source, cachedQueries)
    const prettierConfig = await prettier.resolveConfig(configPath)
    const formatted = await prettier.format(patched, {
      ...prettierConfig,
      filepath: configPath,
    })
    saveConfigFile(formatted)

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

/**
 * Updates only the `experimental.cachedOperations` property inside the
 * `module.exports = { ... }` object literal of a discovery config file.
 *
 * Works as a targeted string edit (no AST): it locates the `experimental: { ... }`
 * block by counting curly braces and either replaces an existing
 * `cachedOperations: [...]` array or inserts a new one before the closing `}`.
 * The rest of the file (comments, `process.env.*`, formatting, ...) is left
 * untouched. A final pass through prettier normalizes the inserted snippet.
 */
function updateCachedOperations(
  source: string,
  cachedQueries: string[]
): string {
  const block = findExperimentalBlock(source)
  if (!block) {
    throw new Error(
      `Couldn't find \`experimental: { ... }\` block in ${configFileName}`
    )
  }

  const arraySnippet = `[\n${cachedQueries.map((q) => `    '${q}',`).join('\n')}\n  ]`
  const propSnippet = `cachedOperations: ${arraySnippet},`

  const inner = source.slice(block.innerStart, block.innerEnd)
  const existing = findCachedOperationsRange(inner)

  if (existing) {
    const absStart = block.innerStart + existing.start
    const absEnd = block.innerStart + existing.end
    return source.slice(0, absStart) + propSnippet + source.slice(absEnd)
  }

  const insertAt = block.innerEnd
  const head = source.slice(0, insertAt).replace(/\s*$/, '')
  const tail = source.slice(insertAt)
  return `${head}\n  ${propSnippet}\n${tail}`
}

/** Find the `experimental: { ... }` block, returning the inner range. */
function findExperimentalBlock(source: string) {
  const re = /(^|\n)[ \t]*experimental\s*:\s*\{/
  const match = re.exec(source)
  if (!match) return null

  const innerStart = match.index + match[0].length
  let depth = 1
  for (let i = innerStart; i < source.length; i++) {
    const ch = source[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return { innerStart, innerEnd: i }
    }
  }
  return null
}

/** Find the `cachedOperations: [...]` property range inside a string. */
function findCachedOperationsRange(inner: string) {
  const re = /(^|\n)[ \t]*cachedOperations\s*:\s*\[/
  const match = re.exec(inner)
  if (!match) return null

  const start = match.index + (match[1] === '\n' ? 1 : 0)
  const arrayStart = match.index + match[0].length
  let depth = 1
  for (let i = arrayStart; i < inner.length; i++) {
    const ch = inner[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        let end = i + 1
        if (inner[end] === ',') end++
        return { start, end }
      }
    }
  }
  return null
}
