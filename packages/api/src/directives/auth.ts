import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import {
  defaultFieldResolver,
  type GraphQLFieldResolver,
  type GraphQLSchema,
} from 'graphql'

import { validateUserAuthentication } from '../platforms/vtex/utils/auth'
import { hasAppliedDirective, markAppliedDirective } from './applied'
import type { Directive } from './index'

const NAME = 'auth'

const directive: Directive = {
  typeDefs: `directive @auth on FIELD_DEFINITION`,
  transformer: (schema: GraphQLSchema) => {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const authDirective = getDirective(schema, fieldConfig, NAME)?.[0]

        if (authDirective) {
          if (hasAppliedDirective(fieldConfig.resolve, NAME)) {
            return fieldConfig
          }

          const originalResolver = fieldConfig.resolve

          const resolve: GraphQLFieldResolver<any, any> = async (
            root,
            args,
            context,
            info
          ) => {
            // Validate user authentication before proceeding with the resolver
            await validateUserAuthentication(context)

            // Continue with the original resolver
            return (originalResolver ?? defaultFieldResolver)(
              root,
              args,
              context,
              info
            )
          }

          fieldConfig.resolve = markAppliedDirective(
            resolve,
            originalResolver,
            NAME
          )
        }

        return fieldConfig
      },
    })
  },
}

export default directive
