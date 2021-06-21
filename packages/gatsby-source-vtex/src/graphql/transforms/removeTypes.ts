import {
  getNamedType,
  getNullableType,
  isInputObjectType,
  isObjectType,
  GraphQLSchema,
} from 'graphql'
import type { Transform } from '@graphql-tools/utils'
import type { GraphQLNamedType, GraphQLField } from 'graphql'

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
  private readonly whitelist = new Set([
    'Int',
    'String',
    'Boolean',
    'Float',
    'ID',
  ])

  constructor(shouldRemoveType: (x: string) => boolean) {
    this.shouldRemoveType = shouldRemoveType
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
      if (
        this.allTypesToRemove.has(typeName) &&
        !this.whitelist.has(typeName)
      ) {
        delete typeMap[typeName]
      }
    }

    const types = Object.keys(typeMap).map((x) => typeMap[x])

    return new GraphQLSchema({
      ...originalSchema.toConfig(),
      types,
    })
  }

  /**
   * Depth first search in the GraphQL's AST
   */
  public dfs(
    node: GraphQLNamedType,
    graph: Record<string, GraphQLNamedType>,
    seen: Set<string>
  ) {
    // Skip visited nodes
    if (seen.has(node.name)) {
      return
    }

    seen.add(node.name)

    // Stop DFS on non-leaf nodes
    if (!(isObjectType(node) || isInputObjectType(node))) {
      return
    }

    const fields = node.getFields()

    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName]
      const type = getNamedType(getNullableType(field.type))

      if (isObjectType(node)) {
        const objectField = field as GraphQLField<any, any>

        for (const arg of objectField.args) {
          const inputType = getNamedType(getNullableType(arg.type))

          this.dfs(graph[inputType.name], graph, seen)
        }
      }

      this.dfs(graph[type.name], graph, seen)
    }
  }
}
