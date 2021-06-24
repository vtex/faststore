import { inspect } from 'util'

import { Kind, visit } from 'graphql'
import type { FieldNode, ExecutionResult } from 'graphql'
import type { Transform, Request } from '@graphql-tools/utils'

export class RemoveAliasTransform implements Transform {
  public transformRequest(originalRequest: Request) {
    /**
     * Cheat sheet:
     * @return
     *  undefined: no action
     *  false: skip visiting this node
     *  visitor.BREAK: stop visiting altogether
     *  null: delete this node
     *  any value: replace this node with the returned value
     */
    const document = visit(originalRequest.document, {
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

    return {
      ...originalRequest,
      document,
    }
  }

  public transformResult(result: ExecutionResult) {
    console.log(inspect(result, false, 100, true))

    return result
  }
}
