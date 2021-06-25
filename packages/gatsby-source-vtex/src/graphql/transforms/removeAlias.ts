import { Kind, visit } from 'graphql'
import type { FieldNode, DocumentNode } from 'graphql'

/**
 * Cheat sheet:
 * @return
 *  undefined: no action
 *  false: skip visiting this node
 *  visitor.BREAK: stop visiting altogether
 *  null: delete this node
 *  any value: replace this node with the returned value
 */
export const removeAliasFields = (document: DocumentNode) =>
  visit(document, {
    [Kind.FIELD]: (node) => {
      if (node.alias) {
        const fieldNode: FieldNode = {
          ...node,
          alias: undefined,
        }

        return fieldNode
      }

      return undefined
    },
  })
