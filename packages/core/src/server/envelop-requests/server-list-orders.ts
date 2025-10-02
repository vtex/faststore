import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerListOrdersQueryQuery,
  ServerListOrdersQueryQueryVariables,
} from '../../../@generated/graphql'

const query = gql(`
  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String) {
    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail) {
      list {
        orderId
        creationDate
        clientName
        items {
          seller
          quantity
          description
          ean
          refId
          id
          productId
          sellingPrice
          price
        }
        totalValue
        status
        statusDescription
        ShippingEstimatedDate
        currencyCode
        customFields {
          type
          value
        }
      }
      paging {
        total
        pages
        currentPage
        perPage
      }
    }
    accountName
  }
`)

export function serverListOrdersQueryRequest({
  req,
  variables,
}: {
  variables: ServerListOrdersQueryQueryVariables
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerListOrdersQueryQueryVariables,
    ServerListOrdersQueryQuery
  >(
    {
      variables,
      operation: query,
    },
    { headers: { ...req.headers } }
  )
}
