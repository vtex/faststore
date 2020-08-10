import { NodePath, Visitor } from '@babel/traverse'
import BabelTypes from '@babel/types'

import { QueryManager } from './manager'

const GQL_TAG = 'gql'
const GATSBY_TAG = 'graphql'

interface Babel {
  types: typeof BabelTypes
}

interface BabelPlugin {
  visitor: Visitor
}

const getGraphqlQuery = (path: NodePath<BabelTypes.TaggedTemplateExpression>) =>
  path.node.quasi.quasis
    .map((q) => q.value.cooked)
    .join('')
    .trim()

export default function babelGQLPlugin(babel: Babel): BabelPlugin {
  const qm = QueryManager.getSingleton()
  const t = babel.types

  return {
    visitor: {
      Program: (p, state: any) => {
        const {
          file: {
            opts: { filename },
          },
        } = state

        p.traverse({
          TaggedTemplateExpression: (path) => {
            if (!path.node.loc) {
              return
            }

            const { tag } = path.node

            if (!t.isIdentifier(tag)) {
              return
            }

            // Tag needs to be graphql or gql
            const isGraphqlTaggedTemplate =
              tag.name === GQL_TAG || tag.name === GATSBY_TAG

            if (!isGraphqlTaggedTemplate) {
              return
            }

            try {
              const query = getGraphqlQuery(path)

              // add graphql query to query manager for later extraction
              qm.addQuery({ query, filename })

              // If the tag is a gql tag, remove if from final code
              if (tag.name === GQL_TAG) {
                path.remove()
              }
            } catch (error) {
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
