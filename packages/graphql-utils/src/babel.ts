import { BREAK, parse, visit } from 'graphql'
import type { Visitor } from '@babel/traverse'
import type BabelTypes from '@babel/types'

const GQL_TAGS = new Set(['gql'])

interface Babel {
  types: typeof BabelTypes
}

interface BabelPlugin {
  visitor: Visitor
}

const getOperationName = (query: string) => {
  let operationName = 'unknown'

  visit(parse(query), {
    OperationDefinition: (node) => {
      const operation = node.name?.value

      if (typeof operation === 'string') {
        operationName = operation
      }

      return BREAK
    },
  })

  return operationName
}

export default function babelGQLPlugin(babel: Babel): BabelPlugin {
  const { types } = babel

  return {
    visitor: {
      Program: (program) => {
        program.traverse({
          TaggedTemplateExpression: (path) => {
            if (!path.node.loc) {
              return
            }

            const { tag } = path.node

            if (!types.isIdentifier(tag) || !GQL_TAGS.has(tag.name)) {
              return
            }

            try {
              // Get query from path
              const query = path.node.quasi.quasis
                .map((q) => q.value.cooked)
                .join('')
                .trim()

              const operationName = getOperationName(query)

              path.replaceWithSourceString(`"${operationName}"`)
            } catch (error: any) {
              throw path.buildCodeFrameError(
                `GraphQL: ${error.message}` ?? 'Unknown graphql parsing error'
              )
            }
          },
        })
      },
    },
  }
}
