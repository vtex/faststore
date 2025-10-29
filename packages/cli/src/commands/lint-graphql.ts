import { Args, Command } from '@oclif/core'
import chalk from 'chalk'
import { lstatSync } from 'fs'
import {
  GraphQLError,
  Kind,
  OperationTypeNode,
  parse,
  type DocumentNode,
} from 'graphql'
import path from 'path'
import ts from 'typescript'
import { logger } from '../utils/logger'
export default class LintGraphql extends Command {
  static flags = {}

  static args = {
    path: Args.string({
      name: 'path',
      description: 'project root path relative to CWD, defaults to CWD',
    }),
  }

  async run() {
    const { args } = await this.parse(LintGraphql)

    const argPath = path.resolve(
      process.env.PWD ?? process.cwd(),
      args.path ?? process.env.PWD ?? process.cwd()
    )
    ;(await listTsFiles(argPath)).map(parseFile)

    logger.log(
      `${chalk.green(
        'success'
      )} - GraphQL schema, types, and optimizations successfully generated 🎉`
    )
  }
}

async function parseFile(filePath: string) {
  if (!isFile(filePath)) return

  logger.log(`
    ${chalk.yellow('info')} - parsing file: ${filePath}`)

  const sourceCode = ts.sys.readFile(filePath)

  if (!sourceCode) return // something impossible happened here

  const sourceAST = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.ESNext,
    true,
    /tsx$/i.test(path.extname(filePath)) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )

  ts.forEachChild(sourceAST, findGraphqlQuery(sourceAST))
}

function isFile(filePath: string) {
  return !lstatSync(filePath).isDirectory()
}

async function listTsFiles(root: string): Promise<Array<string>> {
  let folderRoot = root
  if (isFile(root)) folderRoot = path.dirname(root)

  const { globbySync } = await import('globby')

  return globbySync(
    [root, `!${folderRoot}/**/node_modules/**`, `!${folderRoot}/**/dist/**`],
    {
      expandDirectories: {
        extensions: ['ts', 'tsx'],
      },
    }
  )
}

function findGraphqlQueryVisitor(file: ts.SourceFile) {
  return (node: ts.Node) => {
    if (
      ts.isNoSubstitutionTemplateLiteral(node) ||
      (ts.isCallExpression(node.parent) &&
        (node.parent.expression as ts.Expression).getText() === 'gql' &&
        ts.isStringLiteral(node))
    ) {
      try {
        const AST = parse(node.text, {
          noLocation: true,
        })
        if (hasInvalidQuery(AST)) {
          const error = `⚠️ [GraphQL anonymous query found]: GraphQL queries must have an operation name.\n\nfile📄: ${chalk.yellowBright(file.fileName)}`
          logger.error(`${chalk.red('error')}: ${error}`)
          throw new Error(error)
        }
      } catch (error) {
        if (error instanceof GraphQLError) return //ignore error

        throw error
      }
    }
  }
}

function findGraphqlQuery(file: ts.SourceFile) {
  const visitor = findGraphqlQueryVisitor(file)
  return (node: ts.Node) => {
    visitor(node)

    ts.forEachChild(node, findGraphqlQuery(file))
  }
}

const hasInvalidQuery = (operation: DocumentNode) => {
  return operation.definitions.some(
    (def) =>
      def.kind === Kind.OPERATION_DEFINITION &&
      def.operation === OperationTypeNode.QUERY &&
      !def.name
  )
}
