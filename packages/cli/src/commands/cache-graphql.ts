import { saveFile } from '../utils/file'
import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { getBasePath, withBasePath } from '../utils/directory'
import { logger } from '../utils/logger'
import graphql from 'graphql'
import path from 'path'
import fsExtra from 'fs-extra'
import * as recast from 'recast'
import babelParser from 'recast/parsers/babel.js'
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
 * `module.exports = { ... }` object literal of a discovery config file,
 * preserving comments, formatting, and dynamic expressions (e.g. `process.env`).
 */
function updateCachedOperations(
  source: string,
  cachedQueries: string[]
): string {
  const ast = recast.parse(source, { parser: babelParser })
  const b = recast.types.builders

  const newArray = b.arrayExpression(
    cachedQueries.map((name) => b.stringLiteral(name))
  )

  const isPropertyNamed = (p: any, name: string) =>
    (p.type === 'ObjectProperty' || p.type === 'Property') &&
    ((p.key.type === 'Identifier' && p.key.name === name) ||
      ((p.key.type === 'StringLiteral' || p.key.type === 'Literal') &&
        p.key.value === name))

  let patched = false

  recast.types.visit(ast, {
    visitAssignmentExpression(path: any) {
      const node = path.node
      const isModuleExports =
        node.operator === '=' &&
        node.left.type === 'MemberExpression' &&
        node.left.object.type === 'Identifier' &&
        node.left.object.name === 'module' &&
        node.left.property.type === 'Identifier' &&
        node.left.property.name === 'exports'

      if (!isModuleExports || node.right.type !== 'ObjectExpression') {
        return false
      }

      const experimentalProp = node.right.properties.find((p: any) =>
        isPropertyNamed(p, 'experimental')
      )

      if (
        !experimentalProp ||
        experimentalProp.value.type !== 'ObjectExpression'
      ) {
        return false
      }

      const props = experimentalProp.value.properties
      const idx = props.findIndex((p: any) =>
        isPropertyNamed(p, 'cachedOperations')
      )

      const newProp = b.objectProperty(
        b.identifier('cachedOperations'),
        newArray
      )

      if (idx >= 0) {
        props[idx] = newProp
      } else {
        props.push(newProp)
      }

      patched = true
      return false
    },
  })

  if (!patched) {
    throw new Error(
      `Couldn't find \`module.exports = { ..., experimental: { ... } }\` in ${configFileName}`
    )
  }

  return removeRecastBlankLinesInExperimental(recast.print(ast).code)
}

/**
 * recast inserts spurious blank lines between properties of the `experimental`
 * object when we modify it. Collapse any sequence of blank lines inside that
 * block into none, preserving the rest of the file as-is.
 */
function removeRecastBlankLinesInExperimental(code: string): string {
  const startMatch = code.match(/\n[ \t]*experimental:\s*\{\n/)
  if (!startMatch || startMatch.index === undefined) return code

  const blockStart = startMatch.index + startMatch[0].length
  let depth = 1
  let i = blockStart
  while (i < code.length && depth > 0) {
    const ch = code[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    if (depth === 0) break
    i++
  }
  const blockEnd = i

  const before = code.slice(0, blockStart)
  const block = code.slice(blockStart, blockEnd).replace(/\n[ \t]*\n+/g, '\n')
  const after = code.slice(blockEnd)
  return before + block + after
}
