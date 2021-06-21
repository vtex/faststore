import { isObjectType } from 'graphql'
import type { Transform } from '@graphql-tools/utils'
import type { GraphQLSchema, GraphQLNamedType } from 'graphql'

/**
 * @description: Performs a Depth first search in the GraphQL's AST finding all types that are used in the
 * requested types to remove. For instance, if we have the following SDL
 * ```gql
 * type SKU {
 *    name: String!
 * }
 *
 * type Product {
 *    skus: SKU
 * }
 *
 * type Query {
 *    products: [Product!]!
 * }
 * ```
 * and add the following shouldRemoveType function: `(typename) => typename === 'Product'`. This should return:
 * ```gql
 * type Query {
 *    products: [Product!]!
 * }
 * ```
 */
export class RemoveTypes implements Transform {
  private allTypesToRemove: Set<string> | undefined = undefined
  private readonly shouldRemoveType: (x: string) => boolean

  constructor(removeType: (x: string) => boolean) {
    this.shouldRemoveType = removeType
  }

  public transformSchema(originalSchema: GraphQLSchema): GraphQLSchema {
    const typeMap = originalSchema.getTypeMap()

    if (this.allTypesToRemove === undefined) {
      this.allTypesToRemove = new Set<string>()

      Object.keys(typeMap)
        .filter((typename) => this.shouldRemoveType(typename))
        .forEach((typeName) => {
          const root = typeMap[typeName]
          const visited = this.allTypesToRemove!

          this.dfs(root, typeMap, visited)
        })
    }

    for (const typeName of Object.keys(typeMap)) {
      if (this.allTypesToRemove.has(typeName)) {
        delete typeMap[typeName]
      }
    }

    return originalSchema
  }

  /**
   * Depth first search in the GraphQL's AST
   */
  public dfs(
    node: GraphQLNamedType,
    graph: Record<string, GraphQLNamedType>,
    seen: Set<string>
  ) {
    if (
      // Only object types can be removed for now
      !isObjectType(node) ||
      // Skip visited nodes
      seen.has(node.name)
    ) {
      return
    }

    seen.add(node.name)
    const fields = node.getFields()

    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName]
      const typeString = field.type.toString()
      const type = typeString.startsWith('[')
        ? typeString.slice(1, -1)
        : typeString

      this.dfs(graph[type], graph, seen)
    }
  }
}
