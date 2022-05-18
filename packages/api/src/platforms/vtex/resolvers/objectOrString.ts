import type { GraphQLScalarSerializer } from 'graphql'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const ObjectOrString = new GraphQLScalarType({
  name: 'ObjectOrString',
  description:
    'A string or the string representation of an object (a stringified object).',
  parseValue: toObjectOrString,
  serialize: stringify,
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value)
      } catch (e) {
        return ast.value
      }
    }

    return null
  },
})

function toObjectOrString(value: GraphQLScalarSerializer<any>) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  return null
}

function stringify(value: GraphQLScalarSerializer<any>) {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return null
}
