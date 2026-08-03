import type { GraphQLScalarSerializer } from 'graphql'
import { GraphQLScalarType, type GraphQLScalarValueParser } from 'graphql'
import { Kind } from 'graphql/language'

const toObjectOrString: GraphQLScalarValueParser<any> = (value) => {
  if (typeof value === 'string') {
    return getValueAsObjectOrString(value)
  }

  return null
}

function getValueAsObjectOrString(value: string) {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

const stringify: GraphQLScalarSerializer<string | null> = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return null
}

export const ObjectOrString = new GraphQLScalarType({
  name: 'ObjectOrString',
  description:
    'A string or the string representation of an object (a stringified object).',
  parseValue: toObjectOrString,
  serialize: stringify,
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return getValueAsObjectOrString(ast.value)
    }

    return null
  },
})
