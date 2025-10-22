import { withCacheControl } from '@vtex/faststore-api'
import GraphqlHandler from '@vtex/faststore-core/handlers/graphql'
import { CustomExecutionFunction } from '@vtex/faststore-core/server'
import QueryTypeDefinition from '../../graphql/thirdParty/typeDefs/query.graphql'
import { Query } from '../../resolvers/query'

const Schema = withCacheControl({ Query }, [QueryTypeDefinition])

export default GraphqlHandler(
  CustomExecutionFunction(Schema, () => ({
    str: 'Custom Context text',
  }))
)
